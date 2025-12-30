import { Calendar, Users, TrendingUp, Target } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const HelpModal = ({ isOpen, onClose, topic = 'general' }) => {
  const helpContent = {
    availability: {
      title: 'Availability Management Help',
      icon: Calendar,
      sections: [
        {
          heading: 'What is Availability?',
          content: 'Availability indicates when and how much a person can work on projects. It helps prevent over-allocation and ensures realistic project planning.',
        },
        {
          heading: 'Setting Availability',
          items: [
            'Click "Add Period" to create a new availability window',
            'Choose start and end dates for the period',
            'Set availability percentage (0-100%)',
            '100% = Fully available, 50% = Part-time, 0% = Unavailable',
          ],
        },
        {
          heading: 'Understanding Percentages',
          items: [
            '100%: Available full-time for project work',
            '75%: Available most of the time (e.g., 6 hours/day)',
            '50%: Available half-time (e.g., 4 hours/day)',
            '25%: Limited availability (e.g., 2 hours/day)',
            '0%: Completely unavailable (vacation, leave, etc.)',
          ],
        },
        {
          heading: 'Common Scenarios',
          items: [
            'Vacation: Set 0% availability for vacation dates',
            'Part-time work: Set 50% for part-time periods',
            'Training: Set 25-50% during training periods',
            'Multiple projects: Reflects remaining capacity',
          ],
        },
        {
          heading: 'Important Notes',
          items: [
            'Periods cannot overlap - each date belongs to one period',
            'Default availability is 100% if not specified',
            'System prevents allocations exceeding availability',
            'Edit or delete periods as schedules change',
          ],
        },
      ],
    },
    allocation: {
      title: 'Allocation Management Help',
      icon: Users,
      sections: [
        {
          heading: 'What are Allocations?',
          content: 'Allocations assign personnel to projects with specific percentages and timeframes. They track who is working on what and how much of their time is committed.',
        },
        {
          heading: 'Reading the Timeline',
          items: [
            'Each row represents one person',
            'Each column represents one month',
            'Colored boxes show project allocations',
            'Numbers indicate allocation percentage',
            'Red background warns of over-allocation (>100%)',
          ],
        },
        {
          heading: 'Allocation Percentages',
          items: [
            '100%: Person works full-time on this project',
            '50%: Half their time dedicated to this project',
            'Multiple projects: Percentages should not exceed 100%',
            'Example: 60% Project A + 40% Project B = 100% (optimal)',
          ],
        },
        {
          heading: 'Over-Allocation Warnings',
          content: 'Red backgrounds indicate total allocation exceeds 100%. This suggests the person is over-committed and may experience burnout. Consider redistributing work or extending timelines.',
        },
        {
          heading: 'Best Practices',
          items: [
            'Aim for 80-100% utilization for full-time staff',
            'Leave buffer (10-20%) for unexpected work',
            'Check availability before allocating',
            'Review regularly and adjust as needed',
            'Communicate with team about allocation changes',
          ],
        },
      ],
    },
    matching: {
      title: 'Project Matching Help',
      icon: Target,
      sections: [
        {
          heading: 'How Matching Works',
          content: 'The system compares personnel skills against project requirements, calculating a match score based on skill proficiency, experience level, and availability.',
        },
        {
          heading: 'Match Score Breakdown',
          items: [
            '90-100%: Excellent match - All requirements met or exceeded',
            '70-89%: Good match - Most requirements met',
            '50-69%: Fair match - Partial requirements met',
            'Below 50%: Poor match - Consider training or hiring',
          ],
        },
        {
          heading: 'Understanding Results',
          items: [
            'Green badges: Skills meeting or exceeding requirements',
            'Red badges: Missing skills or insufficient proficiency',
            'Match score considers skill count and proficiency levels',
            'Higher experience levels rank higher at same match score',
            'Availability percentage shown for capacity planning',
          ],
        },
        {
          heading: 'Using Filters',
          items: [
            'Search: Find specific personnel by name',
            'Min Match Score: Show only high-quality matches',
            'Experience Level: Filter by Junior/Mid/Senior',
            'Sort By: Reorder by score, availability, or experience',
          ],
        },
        {
          heading: 'Taking Action',
          items: [
            'Click "Assign" to allocate matched personnel',
            'Review both matching and missing skills',
            'Consider training for near-matches',
            'Check availability before assigning',
            'Balance team composition (mix experience levels)',
          ],
        },
      ],
    },
    utilization: {
      title: 'Utilization Dashboard Help',
      icon: TrendingUp,
      sections: [
        {
          heading: 'Understanding Utilization',
          content: 'Utilization shows what percentage of each person\'s capacity is allocated to projects. It helps identify under-utilized, well-balanced, and over-allocated team members.',
        },
        {
          heading: 'Utilization Categories',
          items: [
            '0%: Available - Not allocated to any projects',
            '1-50%: Under-utilized - Has significant spare capacity',
            '51-80%: Well-balanced - Good utilization with buffer',
            '81-100%: Fully allocated - Working at full capacity',
            'Over 100%: Over-allocated - Unsustainable workload',
          ],
        },
        {
          heading: 'Statistics Overview',
          items: [
            'Total Personnel: Number of team members tracked',
            'Available: People with 0% utilization',
            'Fully Allocated: People at 80-100% capacity',
            'Over-Allocated: People exceeding 100% (warning!)',
          ],
        },
        {
          heading: 'Interpreting the Data',
          content: 'The progress bar shows current utilization. Green indicates healthy levels, purple shows full allocation, and red warns of over-allocation. Click to expand project breakdown.',
        },
        {
          heading: 'Taking Action',
          items: [
            'Under-utilized: Assign to new projects or initiatives',
            'Well-balanced: Maintain current allocation',
            'Fully allocated: Monitor closely, avoid adding work',
            'Over-allocated: Reduce allocation or extend timelines',
            'Review regularly (weekly or bi-weekly)',
          ],
        },
      ],
    },
  };

  const content = helpContent[topic] || helpContent.general;
  const IconComponent = content.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <IconComponent className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <span>{content.title}</span>
        </div>
      }
      size="large"
    >
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {content.sections.map((section, index) => (
          <div key={index} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              {section.heading}
            </h3>
            {section.content && (
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                {section.content}
              </p>
            )}
            {section.items && (
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-start gap-2 text-gray-700 dark:text-slate-300"
                  >
                    <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Need more help?</strong> Contact your system administrator or refer to the
            project documentation for additional guidance.
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="primary" onClick={onClose}>
          Got it!
        </Button>
      </div>
    </Modal>
  );
};

export default HelpModal;
