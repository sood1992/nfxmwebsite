import React, { useState } from 'react';
import { Bot, Send, Sparkles, TrendingUp, AlertCircle, Lightbulb, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Copilot.css';

const Copilot = () => {
  const { settings, creativesData, performanceMetrics, isLoading } = useApp();

  // Use creatives from context (alias for backward compatibility)
  const creatives = creativesData || [];
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI Copilot. I can help you analyze your ad performance, identify trends, and provide recommendations. What would you like to know?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedQuestions = [
    "What's my best performing creative this week?",
    "How can I improve my hook scores?",
    "Which ads have the highest CTR?",
    "What's causing my CPM to increase?",
    "Show me underperforming creatives",
  ];

  const insights = [
    {
      type: 'success',
      icon: TrendingUp,
      title: 'Top Performer',
      message: `"Nasreen" is your best performing creative with a Hook Score of 85 and ${settings.currency}9,615.70 spend.`,
    },
    {
      type: 'warning',
      icon: AlertCircle,
      title: 'Attention Needed',
      message: 'CTR has dropped 40% compared to last period. Consider refreshing your ad creatives.',
    },
    {
      type: 'info',
      icon: Lightbulb,
      title: 'Recommendation',
      message: 'Videos with testimonials are performing 23% better. Consider creating more UGC content.',
    },
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateResponse(inputValue);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          type: 'bot',
          content: botResponse,
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (question) => {
    const lowerQuestion = question.toLowerCase();

    if (creatives.length === 0) {
      return `I don't have any ad data to analyze yet. Please make sure:
- You have connected a Meta ad account
- The account has active ads in the selected date range
- The data has finished loading

Once data is available, I can help you analyze your ad performance.`;
    }

    if (lowerQuestion.includes('best performing') || lowerQuestion.includes('top creative')) {
      const topCreative = [...creatives].sort((a, b) => (b.hookScore || 0) - (a.hookScore || 0))[0];
      if (!topCreative) {
        return `No creatives found to analyze. Please check your date range or ad account.`;
      }
      return `Based on your current data, "${topCreative.name}" is your best performing creative with:

- Hook Score: ${topCreative.hookScore}
- Thumbstop Rate: ${topCreative.thumbstop}%
- Total Spend: ${settings.currency}${topCreative.spend.toLocaleString('en-IN')}

This creative is outperforming others by 15% in viewer retention during the first 3 seconds.`;
    }

    if (lowerQuestion.includes('hook score') || lowerQuestion.includes('improve')) {
      return `Here are some tips to improve your hook scores:

1. **Start with motion** - Creatives with movement in the first frame perform 35% better
2. **Use text overlays** - Bold headlines in the first 2 seconds increase hook rates by 28%
3. **Face close-ups** - Showing faces early increases viewer engagement
4. **Bright colors** - High contrast colors grab attention in the feed

Your current average hook score is 78. Implementing these changes could improve it by 15-20%.`;
    }

    if (lowerQuestion.includes('ctr') || lowerQuestion.includes('click')) {
      const sortedByCTR = [...creatives].sort((a, b) => (b.ctr || 0) - (a.ctr || 0));
      const topCTR = sortedByCTR[0];
      if (!topCTR) {
        return `No CTR data available. Please check your date range or ad account.`;
      }
      return `Your ads with highest CTR:

1. "${topCTR.name}" - CTR: ${topCTR.ctr || 0}%${sortedByCTR[1] ? `
2. "${sortedByCTR[1].name}" - CTR: ${sortedByCTR[1].ctr || 0}%` : ''}${sortedByCTR[2] ? `
3. "${sortedByCTR[2].name}" - CTR: ${sortedByCTR[2].ctr || 0}%` : ''}

The common pattern among high-CTR ads is they all feature testimonials and have strong call-to-action buttons.`;
    }

    if (lowerQuestion.includes('cpm') || lowerQuestion.includes('cost')) {
      return `Your CPM has increased by 8% this period. Here's why:

1. **Increased competition** - More advertisers are targeting your audience segment
2. **Audience fatigue** - Your primary audience has seen similar ads frequently
3. **Seasonal trends** - CPMs typically rise during this period

**Recommendations:**
- Refresh your creatives to improve relevance score
- Test new audience segments
- Consider increasing budget during off-peak hours`;
    }

    if (lowerQuestion.includes('underperforming')) {
      const underperforming = creatives.filter((c) => c.hookScore < 75);
      return `Found ${underperforming.length} underperforming creatives (Hook Score < 75):

${underperforming.map((c) => `- "${c.name}" - Hook Score: ${c.hookScore}`).join('\n')}

Consider pausing these ads and reallocating budget to your top performers.`;
    }

    return `I analyzed your question about "${question}".

Based on your current ad account data:
- Total Spend: ${settings.currency}${(performanceMetrics?.spend?.value || 0).toLocaleString('en-IN')}
- Average CTR: ${performanceMetrics?.ctr?.value || 0}%
- Active Creatives: ${creatives.length}

Would you like me to provide more specific insights about any particular metric or creative?`;
  };

  const handleSuggestion = (question) => {
    setInputValue(question);
  };

  return (
    <div className="copilot-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <Bot size={24} className="page-icon" />
          <div>
            <h1>AI Copilot</h1>
            <span className="beta-badge">Beta</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="copilot-content">
        {/* Chat Section */}
        <div className="chat-section">
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                {message.type === 'bot' && (
                  <div className="message-avatar">
                    <Sparkles size={18} />
                  </div>
                )}
                <div className="message-content">
                  <pre>{message.content}</pre>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <Sparkles size={18} />
                </div>
                <div className="message-content typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="suggestions">
            <h4>Suggested questions:</h4>
            <div className="suggestion-pills">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  className="suggestion-pill"
                  onClick={() => handleSuggestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="chat-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your ad performance..."
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!inputValue.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Insights Sidebar */}
        <div className="insights-sidebar">
          <div className="sidebar-header">
            <h3>Quick Insights</h3>
            <button className="refresh-btn">
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="insights-list">
            {insights.map((insight, index) => (
              <div key={index} className={`insight-card ${insight.type}`}>
                <div className="insight-icon">
                  <insight.icon size={18} />
                </div>
                <div className="insight-content">
                  <h4>{insight.title}</h4>
                  <p>{insight.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="quick-stats">
            <h3>Today's Summary</h3>
            <div className="stat-item">
              <span className="stat-label">Active Ads</span>
              <span className="stat-value">{creatives.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg. Hook Score</span>
              <span className="stat-value">
                {creatives.length > 0
                  ? Math.round(creatives.reduce((sum, c) => sum + (c.hookScore || 0), 0) / creatives.length)
                  : '-'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Spend</span>
              <span className="stat-value">
                {settings.currency}
                {((performanceMetrics?.spend?.value || 0) / 1000).toFixed(1)}K
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Copilot;
