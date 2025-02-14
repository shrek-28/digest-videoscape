import requests
import json
import xml.etree.ElementTree as ET
from typing import List, Dict, Optional
import logging
from dataclasses import dataclass
from datetime import datetime
import time
from transformers import pipeline
from gtts import gTTS
import moviepy.editor as mp
import os

# Data structures
@dataclass
class Paper:
    title: str
    abstract: str
    source: str

class ResearchScraper:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def search_plos(self, query: str) -> Optional[List[Dict]]:
        """Search PLOS articles using their API"""
        search_url = "https://api.plos.org/search"
        params = {
            "q": query,
            "fl": "title,abstract",
            "rows": 10,
            "wt": "json"
        }
        
        try:
            response = requests.get(search_url, params=params)
            response.raise_for_status()
            
            articles = response.json().get("response", {}).get("docs", [])
            results = []
            
            for article in articles:
                title = article.get("title", "No title available")
                if isinstance(title, list):  # Handle cases where title is a list
                    title = title[0]
                abstract = article.get("abstract", "No abstract available")
                results.append(Paper(
                    title=title,
                    abstract=abstract,
                    source="plos"
                ))
            
            return results
        except Exception as e:
            self.logger.error(f"Error searching PLOS: {str(e)}")
            return None

    def search_arxiv(self, query: str) -> Optional[List[Dict]]:
        """Search arXiv articles using their API"""
        search_url = f"http://export.arxiv.org/api/query?search_query=all:{query}&start=0&max_results=10"
        
        try:
            response = requests.get(search_url)
            response.raise_for_status()
            
            root = ET.fromstring(response.text)
            articles = []
            
            for entry in root.findall("{http://www.w3.org/2005/Atom}entry"):
                title = entry.find("{http://www.w3.org/2005/Atom}title").text.strip()
                abstract = entry.find("{http://www.w3.org/2005/Atom}summary").text.strip()
                articles.append(Paper(
                    title=title,
                    abstract=abstract,
                    source="arxiv"
                ))
            
            return articles
        except Exception as e:
            self.logger.error(f"Error searching arXiv: {str(e)}")
            return None

    def save_results(self, data: List[Paper], source: str):
        """Save search results to JSON file"""
        filename = f"uploads/{source}_results.json"
        os.makedirs("uploads", exist_ok=True)
        
        # Convert Paper objects to dictionaries
        serializable_data = [{"title": paper.title, "abstract": paper.abstract} 
                           for paper in data]
        
        try:
            with open(filename, "w", encoding="utf-8") as file:
                json.dump(serializable_data, file, indent=4, ensure_ascii=False)
            self.logger.info(f"Results saved to {filename}")
        except Exception as e:
            self.logger.error(f"Error saving results to JSON: {str(e)}")

class ContentProcessor:
    def __init__(self):
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        self.logger = logging.getLogger(__name__)

    def summarize_text(self, text: str, max_length: int = 150) -> str:
        """Summarize text using BART model"""
        try:
            summary = self.summarizer(text, max_length=max_length, min_length=30, do_sample=False)
            return summary[0]['summary_text']
        except Exception as e:
            self.logger.error(f"Error in summarization: {str(e)}")
            return ""

    def generate_audio(self, text: str, output_path: str) -> str:
        """Convert text to speech using gTTS"""
        try:
            tts = gTTS(text=text, lang='en')
            tts.save(output_path)
            return output_path
        except Exception as e:
            self.logger.error(f"Error generating audio: {str(e)}")
            return ""

    def generate_video(self, text: str, audio_path: str, output_path: str) -> str:
        """Create video with text overlay and audio"""
        try:
            clip_duration = 30
            background = mp.ColorClip(size=(1280, 720), color=(0, 0, 0), duration=clip_duration)
            text_clip = mp.TextClip(text, fontsize=30, color='white', size=(1200, 600))
            text_clip = text_clip.set_position('center').set_duration(clip_duration)
            
            audio = mp.AudioFileClip(audio_path)
            final_clip = mp.CompositeVideoClip([background, text_clip])
            final_clip = final_clip.set_audio(audio)
            
            final_clip.write_videofile(output_path, fps=24)
            return output_path
        except Exception as e:
            self.logger.error(f"Error generating video: {str(e)}")
            return ""

class ResearchPipeline:
    def __init__(self):
        self.scraper = ResearchScraper()
        self.processor = ContentProcessor()
        self.logger = logging.getLogger(__name__)
        
    def process_query(self, query: str) -> Dict:
        """Run the complete pipeline for a given search query"""
        try:
            # Create output directories
            os.makedirs("output/audio", exist_ok=True)
            os.makedirs("output/video", exist_ok=True)
            
            # Scrape papers
            plos_papers = self.scraper.search_plos(query) or []
            arxiv_papers = self.scraper.search_arxiv(query) or []
            
            # Save raw results
            if plos_papers:
                self.scraper.save_results(plos_papers, "plos")
            if arxiv_papers:
                self.scraper.save_results(arxiv_papers, "arxiv")
            
            all_papers = plos_papers + arxiv_papers
            processed_papers = []
            
            for paper in all_papers:
                # Create combined text for processing
                full_text = f"{paper.title}\n\n{paper.abstract}"
                
                # Generate summary
                summary = self.processor.summarize_text(full_text)
                
                # Generate audio
                timestamp = int(time.time())
                audio_path = f"output/audio/{paper.source}_{timestamp}.mp3"
                audio_file = self.processor.generate_audio(summary, audio_path)
                
                # Generate video
                video_path = f"output/video/{paper.source}_{timestamp}.mp4"
                video_file = self.processor.generate_video(summary, audio_path, video_path)
                
                processed_papers.append({
                    "title": paper.title,
                    "source": paper.source,
                    "summary": summary,
                    "audio_path": audio_file,
                    "video_path": video_file
                })
            
            return {
                "total_papers": len(all_papers),
                "processed_papers": processed_papers
            }
            
        except Exception as e:
            self.logger.error(f"Error in pipeline: {str(e)}")
            return {"error": str(e)}

def main():
    # Set up logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Initialize pipeline
    pipeline = ResearchPipeline()
    
    # Get user input
    query = input("Enter search term: ")
    
    # Process query
    results = pipeline.process_query(query)
    
    # Display results
    if "error" in results:
        print(f"Error: {results['error']}")
    else:
        print(f"\nProcessed {results['total_papers']} papers:")
        for paper in results['processed_papers']:
            print(f"\nTitle: {paper['title']}")
            print(f"Source: {paper['source']}")
            print(f"Summary: {paper['summary'][:200]}...")
            print(f"Audio file: {paper['audio_path']}")
            print(f"Video file: {paper['video_path']}")

if __name__ == "__main__":
    main()