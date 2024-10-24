import { surpriseMePrompts } from "../constatns";

export function getRandomPrompt(propmt) {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === propmt) return getRandomPrompt(propmt);

  return randomPrompt;
}
