import { ChatSession, ChatRequest } from '@/types/chat';
import { DateTime } from 'luxon';

type TimeGroupedSessions = Record<string, ChatSession[]>;

// Function to categorize and sort sessions
export const categorizeAndSortSessions = (
  sessions: ChatSession[]
): TimeGroupedSessions => {
  const groupedSessions = sessions.reduce((acc, session) => {
    const updatedAt = DateTime.fromISO(session.updatedAt);
    let groupKey;

    if (updatedAt.hasSame(DateTime.now(), 'day')) {
      groupKey = 'Today';
    } else if (updatedAt.hasSame(DateTime.now().minus({ day: 1 }), 'day')) {
      groupKey = 'Yesterday';
    } else if (updatedAt.hasSame(DateTime.now(), 'month')) {
      groupKey = 'This Month';
    } else if (updatedAt.hasSame(DateTime.now(), 'year')) {
      groupKey = updatedAt.toFormat('MMMM');
    } else {
      groupKey = updatedAt.toFormat('yyyy');
    }

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(session);
    return acc;
  }, {} as TimeGroupedSessions);

  // Sort each group by createdAt date
  Object.keys(groupedSessions).forEach((group) => {
    groupedSessions[group].sort((a, b) => {
      if (a.updatedAt < b.updatedAt) {
        return 1;
      }
      if (a.updatedAt > b.updatedAt) {
        return -1;
      }
      return 0;
    });
  });

  // Get sorted group keys according to custom sort function
  const sortedGroupsKeys = Object.keys(groupedSessions).sort(sortTimeGroups);

  // Create sorted groups based on sorted keys
  const sortedGroups = sortedGroupsKeys.reduce((acc, key) => {
    acc[key] = groupedSessions[key];
    return acc;
  }, {} as TimeGroupedSessions);

  return sortedGroups;
};

const sortTimeGroups = (a: string, b: string): number => {
  const order = ['Today', 'Yesterday', 'This Month'];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  // If both keys are in our predefined order, use that order
  if (order.includes(a) && order.includes(b)) {
    return order.indexOf(a) - order.indexOf(b);
  }

  // If one of the keys is a month of the current year, it should come after our predefined order
  if (months.includes(a) && months.includes(b)) {
    return months.indexOf(a) - months.indexOf(b);
  }

  if (order.includes(a)) {
    return -1;
  }
  if (order.includes(b)) {
    return 1;
  }

  // If both keys are years, sort them as numbers
  if (!isNaN(Number(a)) && !isNaN(Number(b))) {
    return Number(b) - Number(a); // Descending order for years
  }

  return 0;
};

export const getResponseContent = (r: ChatRequest) =>
  (r.resp_body_chunks ?? [])
    .flatMap((lines) => lines.split(/\r?\n/))
    .flatMap((line) => (line.trim() ? [line] : []))
    .map((c) => {
      try {
        const json = JSON.parse(c);

        return json?.message?.content ?? json.choices[0].message.content;
      } catch (e) {
        try {
          const json = JSON.parse(c.split('data:')[1]);
          return json?.message?.content ?? json.choices[0].delta.content;
        } catch (e) {
          return '';
        }
      }
    })
    .join('');
