# Progress Visualization Page

## Overview
The Progress Visualization Page is an independent dashboard that provides comprehensive analytics combining both learning metrics and story progression tracking. It adapts to the learner's emotions and focus levels to show how their performance influences the narrative experience.

## Key Features

### 1. **Granularity Controls**
- Session-level view (last 20 sessions)
- Day-level view (last 14 days)
- Week-level view (last 8 weeks)
- Month-level aggregation

### 2. **Three View Modes**

#### Learning View
- **Concentration Evolution Chart**: Area chart showing focus levels over time with gradient fill
- **Productivity & Engagement Bars**: Dual bar chart comparing task completion and high-focus engagement
- **Mood-Based Performance**: Grid cards showing how different moods correlate with progress
  - Each mood displays session count and average progress percentage
  - Color-coded progress bars for visual impact

#### Story View
- **Narrative Journey Timeline**: Vertical timeline with story chapter milestones
  - Color-coded based on focus level (green for high, blue for medium, gray for low)
  - Shows chapter names, dates, and focus ratings
  - Theme icons for visual variety
- **Story Worlds Explored**: Cards showing different themes the user has experienced
  - Session counts and average focus per theme
- **Story Advancement Rate**: Line chart showing story progress percentage over time

#### Combined View
- **Learning Progress & Story Sync**: Dual-axis line chart
  - Left axis: Concentration (1-5 scale)
  - Right axis: Story Progress (0-100%)
  - Shows direct correlation between focus and narrative advancement
- **Focus Impact Cards**: Explains how different focus levels unlock story outcomes
  - High Focus (4-5): Triumphant outcomes
  - Medium Focus (3): Balanced narrative
  - Lower Focus (1-2): Struggles and growth opportunities
- **Emotional Resonance Cards**: Shows how moods affect story speed and chapters
- **Multi-Dimensional Progress Radar**: 5-point radar chart showing:
  - Concentration
  - Engagement
  - Productivity
  - Story Progress
  - Consistency

### 3. **Quick Stats Dashboard**
Four prominent stat cards at the top:
- Total Sessions (with study time)
- Average Concentration
- Peak Focus
- Story Chapters Unlocked

### 4. **Data Processing**
The page intelligently aggregates data based on the selected granularity:
- **Session**: Individual session data points
- **Day**: Averages and totals for each day
- **Week**: Weekly aggregations with peak focus tracking
- **Month**: Monthly summaries

### 5. **Color Coding & Visual System**
- **Blue/Purple gradients**: Learning and concentration
- **Amber/Orange gradients**: Story progression
- **Green gradients**: Success and high performance
- **Gray gradients**: Struggles or low performance
- Consistent use of shadows, rounded corners, and smooth animations

## Navigation

### Access Points
1. **From Main Study App**: Click the "Progress" button in the header (appears after completing sessions)
2. **From Journal View**: Click the prominent "Advanced Progress Visualization" card in the Analytics tab

### Integration
- Seamlessly integrated with the existing journal entry system
- Uses the same data structure as JournalView and AnalyticsDashboard
- Includes theme information to show story world exploration

## Technical Details

### Dependencies
- **recharts**: For all chart visualizations (Line, Area, Bar, Radar)
- **motion/react**: For smooth animations and transitions
- **shadcn/ui**: Card, Button, Badge, Tabs components

### Data Structure
Extends the existing `JournalEntry` interface with optional `theme` field to track which story theme was active during each session.

### Responsive Design
- Mobile-first approach
- Grid layouts adapt from 1 column on mobile to 2-3 columns on desktop
- Charts resize responsively using ResponsiveContainer
- Granularity buttons wrap on smaller screens

## Future Enhancement Ideas
- Export charts as images
- Download progress reports as PDF
- Compare different time periods
- Set goals and track progress toward them
- Gamification elements tied to analytics milestones
