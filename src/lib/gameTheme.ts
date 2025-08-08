export type GameTheme = {
  primary: string
  primaryForeground: string
  hoverBorder: string
  iconBg: string
  titleHover: string
  buttonStyles: string
}

export const getGameTheme = (gameId: number): GameTheme => {
  switch (gameId) {
    case 1: // Arithmetic Pro - Green (default)
      return {
        primary: "hsl(122, 97%, 50%)",
        primaryForeground: "hsl(220, 13%, 8%)",
        hoverBorder: "hover:border-[hsl(122,97%,50%)]/30",
        iconBg: "bg-[hsl(122,97%,50%)]/10 group-hover:bg-[hsl(122,97%,50%)]/20",
        titleHover: "group-hover:text-[hsl(122,97%,50%)]",
        buttonStyles:
          "bg-[hsl(122,97%,50%)] text-[hsl(220,13%,8%)] hover:bg-[hsl(122,97%,50%)]/90 hover:shadow-[0_0_20px_hsl(122,97%,50%,0.3)] focus-visible:ring-[hsl(122,97%,50%)]",
      }
    case 2: // Sequences Pro - Purple
      return {
        primary: "hsl(270, 95%, 60%)",
        primaryForeground: "hsl(220, 13%, 8%)",
        hoverBorder: "hover:border-[hsl(270,95%,60%)]/30",
        iconBg: "bg-[hsl(270,95%,60%)]/10 group-hover:bg-[hsl(270,95%,60%)]/20",
        titleHover: "group-hover:text-[hsl(270,95%,60%)]",
        buttonStyles:
          "bg-[hsl(270,95%,60%)] text-[hsl(220,13%,8%)] hover:!bg-[hsl(270,95%,60%)]/90 hover:!shadow-[0_0_20px_hsl(270,95%,60%,0.3)] focus-visible:!ring-[hsl(270,95%,60%)]",
      }
    case 3: // Optiver 80 - Red
      return {
        primary: "hsl(0, 84%, 60%)",
        primaryForeground: "hsl(220, 13%, 8%)",
        hoverBorder: "hover:border-[hsl(0,84%,60%)]/30",
        iconBg: "bg-[hsl(0,84%,60%)]/10 group-hover:bg-[hsl(0,84%,60%)]/20",
        titleHover: "group-hover:text-[hsl(0,84%,60%)]",
        buttonStyles:
          "bg-[hsl(0,84%,60%)] text-[hsl(220,13%,8%)] hover:!bg-[hsl(0,84%,60%)]/90 hover:!shadow-[0_0_20px_hsl(0,84%,60%,0.3)] focus-visible:!ring-[hsl(0,84%,60%)]",
      }
    default:
      return {
        primary: "hsl(122, 97%, 50%)",
        primaryForeground: "hsl(220, 13%, 8%)",
        hoverBorder: "hover:border-primary/30",
        iconBg: "bg-primary/10 group-hover:bg-primary/20",
        titleHover: "group-hover:text-primary",
        buttonStyles: "bg-primary text-primary-foreground hover:bg-primary/90",
      }
  }
}
