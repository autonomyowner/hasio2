"use client";

interface FilterTabsProps {
  tabs: { key: string; label: string }[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function FilterTabs({ tabs, activeKey, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`filter-tab ${
            activeKey === tab.key ? "filter-tab-active" : "filter-tab-inactive"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
