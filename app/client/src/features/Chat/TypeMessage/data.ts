import { BookIcon, HeartIcon, PillIcon } from "@/shared/icons";
import { TFunction } from "i18next";

export const suggestedActions = (
  onSetMessage: (text: string) => void,
  t: TFunction
) => [
  {
    icon: BookIcon,
    text: "button.learnAbout",
    action: () => onSetMessage(t("button.learnAbout")),
  },
  {
    icon: HeartIcon,
    text: "button.iHavePain",
    action: () => onSetMessage(t("button.iHavePain")),
  },
  {
    icon: PillIcon,
    text: "button.whatShouldITakeFor",
    action: () => onSetMessage(t("button.whatShouldITakeFor")),
  },
];
