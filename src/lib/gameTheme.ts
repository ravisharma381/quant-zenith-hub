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
    case 4: // Sokoban - Yellow
      return {
        primary: "hsl(45, 93%, 58%)",
        primaryForeground: "hsl(220, 13%, 8%)",
        hoverBorder: "hover:border-[hsl(45,93%,58%)]/30",
        iconBg: "bg-[hsl(45,93%,58%)]/10 group-hover:bg-[hsl(45,93%,58%)]/20",
        titleHover: "group-hover:text-[hsl(45,93%,58%)]",
        buttonStyles:
          "bg-[hsl(45,93%,58%)] text-[hsl(220,13%,8%)] hover:!bg-[hsl(45,93%,58%)]/90 hover:!shadow-[0_0_20px_hsl(45,93%,58%,0.3)] focus-visible:!ring-[hsl(45,93%,58%)]",
      }
    case 5: // Probability Master - Orange
      return {
        primary: "hsl(24, 95%, 53%)",
        primaryForeground: "hsl(220, 13%, 8%)",
        hoverBorder: "hover:border-[hsl(24,95%,53%)]/30",
        iconBg: "bg-[hsl(24,95%,53%)]/10 group-hover:bg-[hsl(24,95%,53%)]/20",
        titleHover: "group-hover:text-[hsl(24,95%,53%)]",
        buttonStyles:
          "bg-[hsl(24,95%,53%)] text-[hsl(220,13%,8%)] hover:!bg-[hsl(24,95%,53%)]/90 hover:!shadow-[0_0_20px_hsl(24,95%,53%,0.3)] focus-visible:!ring-[hsl(24,95%,53%)]",
      }
    case 6: // Memory Sequences - Cyan
      return {
        primary: "hsl(180, 83%, 57%)",
        primaryForeground: "hsl(220, 13%, 8%)",
        hoverBorder: "hover:border-[hsl(180,83%,57%)]/30",
        iconBg: "bg-[hsl(180,83%,57%)]/10 group-hover:bg-[hsl(180,83%,57%)]/20",
        titleHover: "group-hover:text-[hsl(180,83%,57%)]",
        buttonStyles:
          "bg-[hsl(180,83%,57%)] text-[hsl(220,13%,8%)] hover:!bg-[hsl(180,83%,57%)]/90 hover:!shadow-[0_0_20px_hsl(180,83%,57%,0.3)] focus-visible:!ring-[hsl(180,83%,57%)]",
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
