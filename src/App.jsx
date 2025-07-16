// Same imports
import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';
import {
  SunIcon,
  MoonIcon,
  FilmIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
} from '@heroicons/react/24/solid';

const interests = [
  'Adventure', 'Sports', 'Gaming', 'Technology', 'Music', 'Cooking', 'Fitness', 'Travel',
  'Art', 'Movies', 'Books', 'Science', 'Fashion', 'Photography', 'DIY', 'Nature',
  'History', 'Food', 'Cars', 'Anime', 'Pets', 'Comedy', 'Education', 'Lifestyle',
  'Dance', 'Writing', 'Gardening', 'Space', 'Hiking', 'Yoga', 'Podcasts', 'Crafts',
  'Meditation', 'Sustainability', 'Architecture', 'Board Games', 'Camping', 'Fitness Tech',
  'Vlogging', 'Retro Gaming', 'Minimalism', 'Astrology', 'Knitting', 'Skiing'
];

const rowPattern = [3, 4, 5, 4, 5, 4, 5, 3];

const App = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [suggestions, setSuggestions] = useState({ youtube: [], reddit: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const fetchSuggestions = async () => {
    if (selectedInterests.length === 0) {
      setError('Please select at least one interest.');
      return;
    }
    setLoading(true);
    setError(null);

    const apiKey = import.meta.env.VITE_API_KEY;
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/v1';
    const openai = new OpenAI({
      apiKey,
      baseURL: apiBase,
      dangerouslyAllowBrowser: true,
    });

    const prompt = `
      Based on the following interests: ${selectedInterests.join(', ')},
      suggest five to ten YouTube channels and five to ten Reddit subreddits that align with these interests.
      Return the response in JSON format with two arrays: "youtube" and "reddit".
      Each item should have a "name" and a "url" field.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: 'qwen-plus',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });
      const data = JSON.parse(response.choices[0].message.content);
      setSuggestions(data);
    } catch (err) {
      setError('Failed to fetch suggestions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderInterestRows = () => {
    let index = 0;
    return rowPattern.map((count, rowIndex) => {
      const rowItems = interests.slice(index, index + count);
      index += count;
      return (
        <div key={rowIndex} className="flex justify-center gap-3 mb-3 flex-wrap">
          {rowItems.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 backdrop-blur-md border border-glass-border transform active:scale-95 ${
                selectedInterests.includes(interest)
                  ? 'bg-blue-400 text-white'
                  : darkMode
                  ? 'bg-glass-bg text-gray-300 hover:bg-blue-400 hover:text-white'
                  : 'bg-white/50 text-gray-700 hover:bg-blue-300 hover:text-white'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      );
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-cyan-500' : 'bg-gradient-to-br from-gray-100 to-blue-200'} p-8 transition-colors duration-300`}>
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-extrabold ${darkMode ? 'text-blue-200' : 'text-blue-600'} animate-pulse`}>
          Explore What Fuels You 🔍
        </h1>
      </div>
      <div className="max-w-7xl mx-auto flex transition-all duration-700">
        {suggestions.youtube.length > 0 || suggestions.reddit.length > 0 ? (
          <div className="w-1/2 pr-4 animate-slide-in-left">
            <div className="backdrop-blur-md bg-glass-bg border border-glass-border rounded-xl p-4 shadow-xl">
              {suggestions.youtube.length > 0 && (
                <div>
                  <h2 className={`text-xl font-semibold flex items-center space-x-2 ${darkMode ? 'text-blue-200' : 'text-blue-500'} mb-3`}>
                    <FilmIcon className="h-5 w-5" />
                    <span>YouTube Channels</span>
                  </h2>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestions.youtube.map((channel, index) => (
                      <a
                        key={index}
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Click to visit channel"
                        className={`group p-2 rounded-lg border border-glass-border transition-all transform hover:scale-105 flex items-center space-x-2 ${
                          darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white/30 hover:bg-white/50'
                        }`}
                      >
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'} group-hover:underline`}>
                          {channel.name}
                        </h3>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {suggestions.reddit.length > 0 && (
                <div className="mt-4">
                  <h2 className={`text-xl font-semibold flex items-center space-x-2 ${darkMode ? 'text-blue-200' : 'text-blue-500'} mb-3`}>
                    <ChatBubbleLeftIcon className="h-5 w-5" />
                    <span>Reddit Subreddits</span>
                  </h2>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestions.reddit.map((sub, index) => (
                      <a
                        key={index}
                        href={sub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Click to visit subreddit"
                        className={`group p-2 rounded-lg border border-glass-border transition-all transform hover:scale-105 flex items-center space-x-2 ${
                          darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white/30 hover:bg-white/50'
                        }`}
                      >
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'} group-hover:underline`}>
                          {sub.name}
                        </h3>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
        <div className={`${suggestions.youtube.length > 0 || suggestions.reddit.length > 0 ? 'w-1/2 pl-4' : 'w-full max-w-3xl mx-auto'} transition-all duration-700 animate-fade-in`}>
          <div className="backdrop-blur-md bg-glass-bg border border-glass-border rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <h1 className={`text-center text-xl font-bold ${darkMode ? 'text-blue-200' : 'text-blue-500'}`}>
                  Youtube & Reddit Contents by Interests
                </h1>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-glass-bg border border-glass-border backdrop-blur-md hover:bg-blue-400 hover:text-white transition-colors"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
              </button>
            </div>
            {renderInterestRows()}
            <button
              onClick={fetchSuggestions}
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold backdrop-blur-md border border-glass-border transition-colors flex items-center justify-center space-x-2 ${
                darkMode
                  ? 'bg-blue-400 text-white hover:bg-blue-500'
                  : 'bg-blue-300 text-white hover:bg-blue-400'
              } disabled:opacity-50`}
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>{loading ? 'Loading...' : 'Get Recommendations'}</span>
            </button>
            {error && (
              <p className={`text-red-400 text-center mt-4 flex items-center justify-center space-x-1`}>
                <ChatBubbleLeftIcon className="h-5 w-5" />
                <span>{error}</span>
              </p>
            )}
          </div>
        </div>
      </div>
      <footer className="mt-12 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Built with ❤️ by You.
      </footer>
    </div>
  );
};

export default App;
