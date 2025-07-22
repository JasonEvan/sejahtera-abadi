"use client";

import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";

type TabItem = {
  label: string;
  content: React.ReactNode;
};

type CustomTabsProps = {
  tabs: TabItem[];
};

function TabPanel(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`custom-tabpanel-${index}`}
      aria-labelledby={`custom-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export default function CustomTabs({ tabs }: CustomTabsProps) {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={value} onChange={handleChange} aria-label="custom tabs">
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
}
