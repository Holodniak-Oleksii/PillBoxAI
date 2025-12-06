import { BookIcon, ListIcon, SearchIcon } from "@/shared/icons";

export const suggestedActions = (onSetMessage: (text: string) => void) => [
  {
    icon: BookIcon,
    text: "button.learnAbout",
    action: () => onSetMessage("Learn about "),
  },
  {
    icon: SearchIcon,
    text: "button.analyzeImage",
    action: () => onSetMessage("Analyze this image: "),
  },
  {
    icon: ListIcon,
    text: "button.summarizeText",
    action: () => onSetMessage("Summarize this text: "),
  },
];
