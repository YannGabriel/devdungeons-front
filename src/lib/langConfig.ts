import type { ComponentType, SVGAttributes } from 'react';
import {
  SiJavascript,
  SiPython,
  SiHtml5,
  SiCss,
  SiTypescript,
  SiReact,
  SiAngular,
  SiNodedotjs,
  SiNestjs,
  SiDocker,
  SiGit,
  SiMysql,
  SiSpringboot,
} from 'react-icons/si';

export type SiIcon = ComponentType<SVGAttributes<SVGElement> & { size?: number }>;

export interface LangConfig {
  Icon: SiIcon;
  color: string;
}

export const LANG_CONFIG: Record<string, LangConfig> = {
  javascript:    { Icon: SiJavascript, color: '#F7DF1E' },
  python:        { Icon: SiPython,     color: '#3776AB' },
  html:          { Icon: SiHtml5,      color: '#E34F26' },
  html5:         { Icon: SiHtml5,      color: '#E34F26' },
  css:           { Icon: SiCss,        color: '#1572B6' },
  css3:          { Icon: SiCss,        color: '#1572B6' },
  typescript:    { Icon: SiTypescript, color: '#3178C6' },
  react:         { Icon: SiReact,      color: '#61DAFB' },
  angular:       { Icon: SiAngular,    color: '#DD0031' },
  'node.js':     { Icon: SiNodedotjs,  color: '#339933' },
  nodejs:        { Icon: SiNodedotjs,  color: '#339933' },
  nestjs:        { Icon: SiNestjs,     color: '#E0234E' },
  docker:        { Icon: SiDocker,     color: '#2496ED' },
  git:           { Icon: SiGit,        color: '#F05032' },
  sql:           { Icon: SiMysql,      color: '#4479A1' },
  'spring boot': { Icon: SiSpringboot, color: '#6DB33F' },
};

export const getLangConfig = (name: string): LangConfig | null =>
  LANG_CONFIG[name.toLowerCase()] ?? null;
