import openai
import json
from dotenv import dotenv_values
from flask import Flask, render_template, request
from flask_talisman import Talisman

config = dotenv_values('.env')
openai.api_key = config['OPENAI_API_KEY']

application = Flask(__name__,   
            template_folder='templates',
            static_url_path='',
            static_folder='static'
            )

app = application

csp = {
    'default-src': [
        '\'self\'',
        'cdnjs.cloudflare.com'
    ]
}
Talisman(application, content_security_policy=csp)

def get_palette(text):
    prompt = f"""
    You are color palette generating assitant that responds to text prompts for color palettes
    You should generate color palettes that perfectly fit the theme, mood or instructions in the prompt.
    The palettes should be between 2 and 8 colors. 
    
    Q: Convert the following verbal description of a color palette into a list of colors: Tropical Beach
    A: ["#D0E6A5", "#FFDD94", "#FA897B", "#CCABD8", "#3A5A40"]
    
    Q: Convert the following verbal description of a color palette into a list of colors: Instagram
    A: ["#405DE6", "#5851DB", "#833AB4", "#C13584", "#E1306C", "#FD1D1D", "#F56040"]
    
    Output Format: a JSON array of hexadecimal color codes
    
    Q: Convert the following verbal description of a color palette into a list of colors: {text}
    A: 
    """
    
    response = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        messages = [{"role": "user", "content": prompt}],
        max_tokens = 500
    )
    
    response_text = response.choices[0].message['content']
    palette = json.loads(response_text.strip())
    return palette

@application.route('/palette', methods=['POST'])
def prompt_for_palette():
    query = request.form.get("query")
    palette = get_palette(query)
    return {"palette": palette}
    

@application.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    application.run(debug=True)