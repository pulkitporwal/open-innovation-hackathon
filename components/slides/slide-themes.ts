export type Theme = {
  name: string
  colors: {
    background: string
    text: string
    accent: string
  }
}

export type Layout = {
  name: string
  className: string
  description: string
}

export const themes: Theme[] = [
  {
    name: "Default",
    colors: {
      background: "bg-white dark:bg-slate-950",
      text: "text-slate-900 dark:text-slate-50",
      accent: "text-blue-600 dark:text-blue-400",
    },
  },
  {
    name: "Dark",
    colors: {
      background: "bg-slate-900",
      text: "text-slate-50",
      accent: "text-blue-400",
    },
  },
  {
    name: "Light",
    colors: {
      background: "bg-slate-50",
      text: "text-slate-900",
      accent: "text-blue-600",
    },
  },
  {
    name: "Blue",
    colors: {
      background: "bg-blue-50 dark:bg-blue-900",
      text: "text-blue-900 dark:text-blue-50",
      accent: "text-blue-600 dark:text-blue-400",
    },
  },
  {
    name: "Green",
    colors: {
      background: "bg-green-50 dark:bg-green-900",
      text: "text-green-900 dark:text-green-50",
      accent: "text-green-600 dark:text-green-400",
    },
  },
]

export const layouts: Layout[] = [
  {
    name: "Centered",
    className: "flex flex-col items-center justify-center text-center",
    description: "Content centered on the slide",
  },
  {
    name: "Left Aligned",
    className: "flex flex-col items-start justify-center",
    description: "Content aligned to the left",
  },
  {
    name: "Right Aligned",
    className: "flex flex-col items-end justify-center",
    description: "Content aligned to the right",
  },
  {
    name: "Two Column",
    className: "grid grid-cols-2 gap-8 items-center",
    description: "Content split into two columns",
  },
  {
    name: "Split Screen",
    className: "grid grid-cols-2 gap-0 h-full",
    description: "Screen split into two equal sections",
  },
] 