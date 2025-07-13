'use client';

import { useState } from 'react';
import Link from 'next/link';

interface LifeStats {
  age: number;
  yearsLived: number;
  yearsRemaining: number;
  percentageLived: number;
  daysLived: number;
  weeksLived: number;
  monthsLived: number;
  daysRemaining: number;
  weeksRemaining: number;
  monthsRemaining: number;
}

export default function LifeVisualizationPage() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [lifeStats, setLifeStats] = useState<LifeStats | null>(null);
  const [averageLifeExpectancy] = useState<number>(79); // US average life expectancy

  const calculateLifeStats = (birthDateString: string): LifeStats => {
    const birth = new Date(birthDateString);
    const now = new Date();
    const death = new Date(birth.getFullYear() + averageLifeExpectancy, birth.getMonth(), birth.getDate());
    
    const age = now.getFullYear() - birth.getFullYear();
    const yearsLived = age;
    const yearsRemaining = Math.max(0, averageLifeExpectancy - age);
    
    const totalDays = (death.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24);
    const daysLived = (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24);
    const daysRemaining = Math.max(0, totalDays - daysLived);
    
    const percentageLived = Math.min(100, (daysLived / totalDays) * 100);
    
    return {
      age,
      yearsLived,
      yearsRemaining,
      percentageLived,
      daysLived: Math.floor(daysLived),
      weeksLived: Math.floor(daysLived / 7),
      monthsLived: Math.floor(daysLived / 30.44),
      daysRemaining: Math.floor(daysRemaining),
      weeksRemaining: Math.floor(daysRemaining / 7),
      monthsRemaining: Math.floor(daysRemaining / 30.44)
    };
  };

  const handleBirthDateChange = (date: string) => {
    setBirthDate(date);
    if (date) {
      const stats = calculateLifeStats(date);
      setLifeStats(stats);
    } else {
      setLifeStats(null);
    }
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className="content-section">
      <div className="post-header">
        <Link href="/projects" className="post-category">
          PROJECTS
        </Link>
        <div className="header-content">
          <h1 className="post-title">Life visualization</h1>
        </div>
        <p className="post-subtitle">
          A visual representation of your life's timeline - showing how much time has passed and how much potentially remains.
        </p>
      </div>

      <div className="life-visualization-container">
        {/* Birth Date Input */}
        <div className="birth-date-section">
          <label htmlFor="birthDate" className="birth-date-label">
            When were you born?
          </label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => handleBirthDateChange(e.target.value)}
            className="birth-date-input"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Life Timeline Visualization */}
        {lifeStats && (
          <div className="life-timeline-section">
            <div className="timeline-container">
              <div className="timeline-header">
                <h2 className="timeline-title">Your life timeline</h2>
                <p className="timeline-subtitle">
                  Based on average life expectancy of {averageLifeExpectancy} years
                </p>
              </div>
              
              <div className="timeline-visualization">
                <div className="timeline-bar">
                  <div 
                    className="timeline-lived"
                    style={{ width: `${lifeStats.percentageLived}%` }}
                  >
                    <span className="timeline-label">Lived</span>
                  </div>
                  <div 
                    className="timeline-remaining"
                    style={{ width: `${100 - lifeStats.percentageLived}%` }}
                  >
                    <span className="timeline-label">Remaining</span>
                  </div>
                </div>
                
                <div className="timeline-stats">
                  <div className="stat-item">
                    <span className="stat-value">{lifeStats.percentageLived.toFixed(1)}%</span>
                    <span className="stat-label">Complete</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{lifeStats.age}</span>
                    <span className="stat-label">Years old</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{lifeStats.yearsRemaining}</span>
                    <span className="stat-label">Years left</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Statistics */}
        {lifeStats && (
          <div className="life-stats-section">
            <h2 className="stats-title">Life statistics</h2>
            
            <div className="stats-grid">
              <div className="stats-column">
                <h3 className="stats-column-title">Time lived</h3>
                <div className="stat-card">
                  <span className="stat-number">{formatNumber(lifeStats.yearsLived)}</span>
                  <span className="stat-unit">Years</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{formatNumber(lifeStats.monthsLived)}</span>
                  <span className="stat-unit">Months</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{formatNumber(lifeStats.weeksLived)}</span>
                  <span className="stat-unit">Weeks</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{formatNumber(lifeStats.daysLived)}</span>
                  <span className="stat-unit">Days</span>
                </div>
              </div>
              
              <div className="stats-column">
                <h3 className="stats-column-title">Time remaining</h3>
                <div className="stat-card remaining">
                  <span className="stat-number">{formatNumber(lifeStats.yearsRemaining)}</span>
                  <span className="stat-unit">Years</span>
                </div>
                <div className="stat-card remaining">
                  <span className="stat-number">{formatNumber(lifeStats.monthsRemaining)}</span>
                  <span className="stat-unit">Months</span>
                </div>
                <div className="stat-card remaining">
                  <span className="stat-number">{formatNumber(lifeStats.weeksRemaining)}</span>
                  <span className="stat-unit">Weeks</span>
                </div>
                <div className="stat-card remaining">
                  <span className="stat-number">{formatNumber(lifeStats.daysRemaining)}</span>
                  <span className="stat-unit">Days</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reflection Section */}
        {lifeStats && (
          <div className="reflection-section">
            <h2 className="reflection-title">Perspective</h2>
            <div className="reflection-content">
              <p className="reflection-text">
                You've lived approximately <strong>{formatNumber(lifeStats.daysLived)} days</strong> so far. 
                That's {formatNumber(lifeStats.weeksLived)} weeks, {formatNumber(lifeStats.monthsLived)} months, 
                or {lifeStats.yearsLived} years of experiences, growth, and memories.
              </p>
              <p className="reflection-text">
                If you live to the average life expectancy, you have roughly <strong>{formatNumber(lifeStats.daysRemaining)} days</strong> remaining. 
                That's {formatNumber(lifeStats.weeksRemaining)} weeks, {formatNumber(lifeStats.monthsRemaining)} months, 
                or {lifeStats.yearsRemaining} years to create, learn, love, and make a difference.
              </p>
              <p className="reflection-text">
                How will you spend these precious days?
              </p>
            </div>
          </div>
        )}

        {/* Visual Dot Representations */}
        {lifeStats && (
          <div className="dot-visualizations-section">
            <div className="dot-visualizations-container">
              <h2 className="dot-visualizations-title">Visual representations</h2>
            
            {/* Years Visualization */}
            <div className="dot-visualization">
              <h3 className="dot-visualization-title">Years ({averageLifeExpectancy} total)</h3>
              <div className="dot-grid years-grid">
                {Array.from({ length: averageLifeExpectancy }, (_, i) => (
                  <div
                    key={i}
                    className={`dot ${i < lifeStats.yearsLived ? 'dot-lived' : 'dot-remaining'}`}
                    title={`Year ${i + 1}${i < lifeStats.yearsLived ? ' (lived)' : ' (remaining)'}`}
                  />
                ))}
              </div>
              <div className="dot-legend">
                <span className="legend-item">
                  <span className="legend-dot dot-lived"></span>
                  <span className="legend-text">{lifeStats.yearsLived} years lived</span>
                </span>
                <span className="legend-item">
                  <span className="legend-dot dot-remaining"></span>
                  <span className="legend-text">{lifeStats.yearsRemaining} years remaining</span>
                </span>
              </div>
            </div>

            {/* Months Visualization */}
            <div className="dot-visualization">
              <h3 className="dot-visualization-title">Months ({averageLifeExpectancy * 12} total)</h3>
              <div className="dot-grid months-grid">
                {Array.from({ length: averageLifeExpectancy * 12 }, (_, i) => (
                  <div
                    key={i}
                    className={`dot ${i < lifeStats.monthsLived ? 'dot-lived' : 'dot-remaining'}`}
                    title={`Month ${i + 1}${i < lifeStats.monthsLived ? ' (lived)' : ' (remaining)'}`}
                  />
                ))}
              </div>
              <div className="dot-legend">
                <span className="legend-item">
                  <span className="legend-dot dot-lived"></span>
                  <span className="legend-text">{formatNumber(lifeStats.monthsLived)} months lived</span>
                </span>
                <span className="legend-item">
                  <span className="legend-dot dot-remaining"></span>
                  <span className="legend-text">{formatNumber(lifeStats.monthsRemaining)} months remaining</span>
                </span>
              </div>
            </div>

            {/* Weeks Visualization */}
            <div className="dot-visualization">
              <h3 className="dot-visualization-title">Weeks ({Math.floor(averageLifeExpectancy * 52.18)} total)</h3>
              <div className="dot-grid weeks-grid">
                {Array.from({ length: Math.floor(averageLifeExpectancy * 52.18) }, (_, i) => (
                  <div
                    key={i}
                    className={`dot ${i < lifeStats.weeksLived ? 'dot-lived' : 'dot-remaining'}`}
                    title={`Week ${i + 1}${i < lifeStats.weeksLived ? ' (lived)' : ' (remaining)'}`}
                  />
                ))}
              </div>
              <div className="dot-legend">
                <span className="legend-item">
                  <span className="legend-dot dot-lived"></span>
                  <span className="legend-text">{formatNumber(lifeStats.weeksLived)} weeks lived</span>
                </span>
                <span className="legend-item">
                  <span className="legend-dot dot-remaining"></span>
                  <span className="legend-text">{formatNumber(lifeStats.weeksRemaining)} weeks remaining</span>
                </span>
              </div>
            </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!lifeStats && (
          <div className="instructions-section">
            <div className="instructions-card">
              <h2 className="instructions-title">Get started</h2>
              <p className="instructions-text">
                Enter your birth date above to see a visual representation of your life's timeline. 
                This tool uses the average life expectancy of {averageLifeExpectancy} years to provide perspective on time.
              </p>
              <p className="instructions-text">
                Remember: This is just a visualization based on averages. Your actual life expectancy may vary based on many factors including genetics, lifestyle, and circumstances.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 