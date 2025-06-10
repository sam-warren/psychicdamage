import React from "react"

// ========================================
// BASE PATTERN FORMATTERS
// ========================================
// These handle individual text patterns and return HTML strings

export const formatDicePattern = (text: string): string => {
  return text.replace(
    /(\d+d\d+(?:\s*[+\-]\s*\d+)?)/gi,
    '<span class="font-mono text-sm bg-secondary/60 px-1.5 py-0.5 rounded border border-border/50 text-foreground">$1</span>'
  )
}

export const formatMeasurementPattern = (text: string): string => {
  return text.replace(/(\d+)\s*(ft\.?|feet)/gi, (match, number, unit) => {
    return `<span class="font-mono text-sm font-medium text-foreground">${number}</span><span class="text-muted-foreground text-sm ml-0.5">${unit.toLowerCase()}</span>`
  })
}

export const formatDCPattern = (text: string): string => {
  return text.replace(
    /DC\s*(\d+)/gi,
    '<span class="font-mono text-xs font-medium text-foreground bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">DC $1</span>'
  )
}

export const formatToHitPattern = (text: string): string => {
  return text.replace(
    /([+\-]\d+)\s+to\s+hit/gi,
    '<span class="font-mono text-sm font-medium text-foreground bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">$1  to hit</span>'
  )
}

export const formatHitPattern = (text: string): string => {
  return text.replace(
    /Hit:/gi,
    '<span class="font-semibold text-foreground py-0.5 rounded">| Hit: </span>'
  )
}

export const formatSkillModifierPattern = (text: string): string => {
  return text.replace(
    /\+(\d+)/g,
    '<span class="font-mono font-medium text-foreground px-1 py-0.5 rounded text-sm">+$1</span>'
  )
}

// ========================================
// COMPOSITE FORMATTERS
// ========================================
// These combine multiple base formatters

export const formatCombatText = (text: string): string => {
  return [
    formatHitPattern,
    formatMeasurementPattern,
    formatDicePattern,
    formatDCPattern,
    formatToHitPattern,
  ].reduce((acc, formatter) => formatter(acc), text)
}

export const formatMovementText = (text: string): string => {
  return formatMeasurementPattern(text)
}

export const formatSkillsText = (text: string): string => {
  return formatSkillModifierPattern(text)
}

export const formatSensesText = (text: string): string => {
  return formatMeasurementPattern(text)
}

// ========================================
// JSX COMPONENT FORMATTERS
// ========================================
// These return JSX components for direct use

export const formatAbilityScore = (score: number) => {
  const modifier = Math.floor((score - 10) / 2)
  return (
    <span className="font-mono">
      <span className="font-semibold text-base">
        {modifier >= 0 ? "+" : ""}
        {modifier}
      </span>
      <span className="text-muted-foreground ml-1 text-xs">({score})</span>
    </span>
  )
}

export const formatDice = (dice: string) => {
  return (
    <span className="font-mono text-xs bg-secondary/60 px-2 py-1 rounded border border-border/50 text-foreground">
      {dice}
    </span>
  )
}

export const formatNumber = (num: string | number) => {
  return (
    <span className="font-mono text-sm font-semibold text-foreground">
      {num}
    </span>
  )
}

// ========================================
// LEGACY COMPATIBILITY FUNCTIONS
// ========================================
// These maintain backward compatibility with existing code

export const formatMeasurement = formatMovementText
export const formatSkills = formatSkillsText
export const formatHit = formatHitPattern
export const formatDescription = formatCombatText
