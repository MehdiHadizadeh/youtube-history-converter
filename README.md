# YouTube History Converter

Convert your YouTube Watch History HTML file from Google Takeout into clean, structured JSON format. Privacy-first, client-side processing - your data never leaves your browser.

## 🎯 Why Use This Tool?

After converting your YouTube history to JSON, you can use it with analysis websites like:

- **[YouTube Watch History Analysis](https://www.youtubewatchhistoryanalysis.com/)** - Discover which YouTube channels you watch the most, your viewing patterns, peak watching times, and more!
- Other YouTube analytics tools that accept JSON format

This tool allows you to **see which YouTube channels you watched the most** and gain insights into your viewing habits without sharing your raw data with third parties.

## ✨ Features

- 🔒 **100% Client-Side**: All processing happens in your browser
- 📊 **Clean JSON Output**: Structured, well-formatted data ready for analysis
- ⚡ **Fast**: Processes thousands of entries in seconds
- 🎯 **Accurate**: Uses DOMParser for reliable HTML parsing
- 🌐 **No Dependencies**: Pure vanilla JavaScript
- 📱 **Responsive**: Works on desktop and mobile


## 🚀 Quick Start

### Option 1: Use Online (Recommended)

Visit the live demo: [youtube-history-converter.netlify.app](https://youtube-history-converter.netlify.app/)

### Option 2: Run Locally

1. Clone this repository:

```bash
git clone https://github.com/MehdiHadizadeh/youtube-history-converter
```

2. Open `index.html` in your browser (no server required!)

## 📖 How to Get Your YouTube Data

1. Go to [Google Takeout](https://takeout.google.com)
2. Click "Deselect all"
3. Scroll down and select only **"YouTube and YouTube Music"**
4. Click **"All YouTube data included"** and deselect everything except:
   - **History** (make sure this is checked)
5. Click **"Next step"**
6. Choose your delivery method and file type (ZIP recommended)
7. Click **"Create export"**
8. Wait for the email from Google (can take minutes to hours)
9. Download and extract the ZIP file
10. Navigate to: `Takeout/YouTube and YouTube Music/history/`
11. Find the file: **`watch-history.html`**
12. Upload it to this converter


## 📋 What Gets Converted

The converter processes only **"Watched"** entries and ignores **"Viewed"** entries (posts, community content, etc.).

### Input HTML Example

```html
<div class="outer-cell mdl-cell mdl-cell--12-col mdl-shadow--2dp">
  <div class="mdl-grid">
    <div class="header-cell mdl-cell mdl-cell--12-col">
      <p class="mdl-typography--title">YouTube<br /></p>
    </div>
    <div class="content-cell mdl-cell--6-col mdl-typography--body-1">
      Watched <a href="https://www.youtube.com/watch?v=...">Video Title</a
      ><br />
      <a href="https://www.youtube.com/channel/...">Channel Name</a><br />
      Nov 23, 2025, 1:38:42 AM GMT+03:30<br />
    </div>
    <div class="content-cell mdl-cell--12-col mdl-typography--caption">
      <b>Products:</b><br />&emsp;YouTube<br />
      <b>Why is this here?</b><br />
      &emsp;YouTube watch history
    </div>
  </div>
</div>
```

### Output JSON Format

```json
{
  "header": "YouTube",
  "title": "Watched Video Title",
  "titleUrl": "https://www.youtube.com/watch?v=...",
  "subtitles": [
    {
      "name": "Channel Name",
      "url": "https://www.youtube.com/channel/..."
    }
  ],
  "time": "2025-11-22T22:08:42.888Z",
  "products": ["YouTube"],
  "activityControls": ["YouTube watch history"]
}
```

## 🎯 Key Features Explained

### Date Conversion

Converts YouTube's local time format to UTC ISO 8601:

- **Input**: `Nov 23, 2025, 1:38:42 AM GMT+03:30`
- **Output**: `2025-11-22T22:08:42.888Z`

### Filtering Logic

Only includes entries that:

1. Start with "Watched" (not "Viewed")
2. Have "YouTube watch history" in activity controls
3. Have valid date/time information
4. Have a valid video title and URL

## 🏗️ Project Structure

```
youtube-history-parser/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── src/
│   ├── parser.js       # Main logic and UI handlers
│   ├── extractors.js   # Field extraction functions
│   ├── date-utils.js   # Date parsing utilities
│   └── html-utils.js   # HTML parsing utilities
└── README.md           # This file
```

## 💡 Use Cases

- **Find your most-watched channels** using analysis tools
- Analyze your YouTube viewing habits and patterns
- Export data for personal analytics and data visualization
- Create viewing history backups for archival purposes
- Data portability and privacy control
- Research and statistical analysis of your media consumption

## 🔐 Privacy & Security

- ✅ No data uploaded to any server
- ✅ No tracking or analytics
- ✅ No third-party scripts
- ✅ Open source and auditable
- ✅ Your data stays on your device
- ✅ Process your data safely before sharing with any analysis tool

## 📝 License

MIT License - feel free to use, modify, and distribute!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

Made with ❤️ for  YouTube users who want to understand their viewing habits
