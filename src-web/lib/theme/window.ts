import type { Theme, ThemeComponentColors } from '@yaakapp-internal/plugins';
import { defaultDarkTheme, defaultLightTheme } from './themes';
import { APIDoctorColor } from './yaakColor';

export type APIDoctorColors = {
  surface: APIDoctorColor;
  surfaceHighlight?: APIDoctorColor;
  surfaceActive?: APIDoctorColor;

  text: APIDoctorColor;
  textSubtle?: APIDoctorColor;
  textSubtlest?: APIDoctorColor;

  border?: APIDoctorColor;
  borderSubtle?: APIDoctorColor;
  borderFocus?: APIDoctorColor;

  shadow?: APIDoctorColor;
  backdrop?: APIDoctorColor;
  selection?: APIDoctorColor;

  primary?: APIDoctorColor;
  secondary?: APIDoctorColor;
  info?: APIDoctorColor;
  success?: APIDoctorColor;
  notice?: APIDoctorColor;
  warning?: APIDoctorColor;
  danger?: APIDoctorColor;
};

export type APIDoctorTheme = {
  id: string;
  name: string;
  base: APIDoctorColors;
  components?: Partial<{
    dialog: Partial<APIDoctorColors>;
    menu: Partial<APIDoctorColors>;
    toast: Partial<APIDoctorColors>;
    sidebar: Partial<APIDoctorColors>;
    responsePane: Partial<APIDoctorColors>;
    appHeader: Partial<APIDoctorColors>;
    button: Partial<APIDoctorColors>;
    banner: Partial<APIDoctorColors>;
    templateTag: Partial<APIDoctorColors>;
    urlBar: Partial<APIDoctorColors>;
    editor: Partial<APIDoctorColors>;
    input: Partial<APIDoctorColors>;
  }>;
};

export type APIDoctorColorKey = keyof ThemeComponentColors;

type ComponentName = keyof NonNullable<APIDoctorTheme['components']>;

type CSSVariables = Record<APIDoctorColorKey, string | undefined>;

function themeVariables(
  theme: Theme,
  component?: ComponentName,
  base?: CSSVariables,
): CSSVariables | null {
  const cmp =
    component == null
      ? theme.base
      : (theme.components?.[component] ?? ({} as ThemeComponentColors));
  const c = (s: string | undefined) => yc(theme, s);
  const vars: CSSVariables = {
    surface: cmp.surface,
    surfaceHighlight: cmp.surfaceHighlight ?? c(cmp.surface)?.lift(0.06).css(),
    surfaceActive: cmp.surfaceActive ?? c(cmp.primary)?.lower(0.2).translucify(0.8).css(),
    backdrop: cmp.backdrop ?? c(cmp.surface)?.lower(0.2).translucify(0.2).css(),
    selection: cmp.selection ?? c(cmp.primary)?.lower(0.1).translucify(0.7).css(),
    border: cmp.border ?? c(cmp.surface)?.lift(0.11)?.css(),
    borderSubtle: cmp.borderSubtle ?? c(cmp.border)?.lower(0.06)?.css(),
    borderFocus: c(cmp.info)?.translucify(0.5)?.css(),
    text: cmp.text,
    textSubtle: cmp.textSubtle ?? c(cmp.text)?.lower(0.2)?.css(),
    textSubtlest: cmp.textSubtlest ?? c(cmp.text)?.lower(0.3)?.css(),
    shadow:
      cmp.shadow ??
      APIDoctorColor.black()
        .translucify(theme.dark ? 0.7 : 0.93)
        .css(),
    primary: cmp.primary,
    secondary: cmp.secondary,
    info: cmp.info,
    success: cmp.success,
    notice: cmp.notice,
    warning: cmp.warning,
    danger: cmp.danger,
  };

  // Extend with base
  for (const [k, v] of Object.entries(vars)) {
    if (!v && base?.[k as APIDoctorColorKey]) {
      vars[k as APIDoctorColorKey] = base[k as APIDoctorColorKey];
    }
  }

  return vars;
}

function templateTagColorVariables(color: APIDoctorColor | null): Partial<CSSVariables> {
  if (color == null) return {};

  return {
    text: color.lift(0.6).css(),
    textSubtle: color.lift(0.4).css(),
    textSubtlest: color.css(),
    surface: color.lower(0.2).translucify(0.8).css(),
    border: color.lower(0.2).translucify(0.2).css(),
    surfaceHighlight: color.lower(0.1).translucify(0.7).css(),
  };
}

function toastColorVariables(color: APIDoctorColor | null): Partial<CSSVariables> {
  if (color == null) return {};

  return {
    text: color.lift(0.8).css(),
    textSubtle: color.lift(0.8).translucify(0.3).css(),
    surface: color.translucify(0.9).css(),
    surfaceHighlight: color.translucify(0.8).css(),
    border: color.lift(0.3).translucify(0.6).css(),
  };
}

function bannerColorVariables(color: APIDoctorColor | null): Partial<CSSVariables> {
  if (color == null) return {};

  return {
    text: color.lift(0.8).css(),
    textSubtle: color.translucify(0.3).css(),
    textSubtlest: color.translucify(0.6).css(),
    surface: color.translucify(0.95).css(),
    border: color.lift(0.3).translucify(0.8).css(),
  };
}

function buttonSolidColorVariables(
  color: APIDoctorColor | null,
  isDefault: boolean = false,
): Partial<CSSVariables> {
  if (color == null) return {};

  const theme: Partial<ThemeComponentColors> = {
    text: 'white',
    surface: color.lower(0.3).css(),
    surfaceHighlight: color.lower(0.1).css(),
    border: color.css(),
  };

  if (isDefault) {
    theme.text = undefined; // Inherit from parent
    theme.surface = undefined; // Inherit from parent
    theme.surfaceHighlight = color.lift(0.08).css();
  }

  return theme;
}

function buttonBorderColorVariables(
  color: APIDoctorColor | null,
  isDefault: boolean = false,
): Partial<CSSVariables> {
  if (color == null) return {};

  const vars: Partial<CSSVariables> = {
    text: color.lift(0.8).css(),
    textSubtle: color.lift(0.55).css(),
    textSubtlest: color.lift(0.4).translucify(0.6).css(),
    surfaceHighlight: color.translucify(0.8).css(),
    borderSubtle: color.translucify(0.5).css(),
    border: color.translucify(0.3).css(),
  };

  if (isDefault) {
    vars.borderSubtle = color.lift(0.28).css();
    vars.border = color.lift(0.5).css();
  }

  return vars;
}

function variablesToCSS(
  selector: string | null,
  vars: Partial<CSSVariables> | null,
): string | null {
  if (vars == null) {
    return null;
  }

  const css = Object.entries(vars ?? {})
    .filter(([, value]) => value)
    .map(([name, value]) => `--${name}: ${value};`)
    .join('\n');

  return selector == null ? css : `${selector} {\n${indent(css)}\n}`;
}

function componentCSS(theme: Theme, component: ComponentName): string | null {
  if (theme.components == null) {
    return null;
  }

  const themeVars = themeVariables(theme, component);
  return variablesToCSS(`.x-theme-${component}`, themeVars);
}

function buttonCSS(
  theme: Theme,
  color: APIDoctorColorKey,
  colors?: ThemeComponentColors,
): string | null {
  const yaakColor = yc(theme, colors?.[color]);
  if (yaakColor == null) {
    return null;
  }

  return [
    variablesToCSS(`.x-theme-button--solid--${color}`, buttonSolidColorVariables(yaakColor)),
    variablesToCSS(`.x-theme-button--border--${color}`, buttonBorderColorVariables(yaakColor)),
  ].join('\n\n');
}

function bannerCSS(
  theme: Theme,
  color: APIDoctorColorKey,
  colors?: ThemeComponentColors,
): string | null {
  const yaakColor = yc(theme, colors?.[color]);
  if (yaakColor == null) {
    return null;
  }

  return [variablesToCSS(`.x-theme-banner--${color}`, bannerColorVariables(yaakColor))].join(
    '\n\n',
  );
}

function toastCSS(theme: Theme, color: APIDoctorColorKey, colors?: ThemeComponentColors): string | null {
  const yaakColor = yc(theme, colors?.[color]);
  if (yaakColor == null) {
    return null;
  }

  return [variablesToCSS(`.x-theme-toast--${color}`, toastColorVariables(yaakColor))].join('\n\n');
}

function templateTagCSS(
  theme: Theme,
  color: APIDoctorColorKey,
  colors?: ThemeComponentColors,
): string | null {
  const yaakColor = yc(theme, colors?.[color]);
  if (yaakColor == null) {
    return null;
  }

  return [
    variablesToCSS(`.x-theme-templateTag--${color}`, templateTagColorVariables(yaakColor)),
  ].join('\n\n');
}

export function getThemeCSS(theme: Theme): string {
  theme.components = theme.components ?? {};
  // Toast defaults to menu styles
  theme.components.toast = theme.components.toast ?? theme.components.menu ?? {};
  const { components, id, label } = theme;
  const colors = Object.keys(theme.base).reduce((prev, key) => {
    return { ...prev, [key]: theme.base[key as APIDoctorColorKey] };
  }, {}) as ThemeComponentColors;

  let themeCSS = '';
  try {
    const baseCss = variablesToCSS(null, themeVariables(theme));
    themeCSS = [
      baseCss,
      ...Object.keys(components ?? {}).map((key) => componentCSS(theme, key as ComponentName)),
      variablesToCSS(
        `.x-theme-button--solid--default`,
        buttonSolidColorVariables(yc(theme, theme.base.surface), true),
      ),
      variablesToCSS(
        `.x-theme-button--border--default`,
        buttonBorderColorVariables(yc(theme, theme.base.surface), true),
      ),
      ...Object.keys(colors ?? {}).map((key) =>
        buttonCSS(theme, key as APIDoctorColorKey, theme.components?.button ?? colors),
      ),
      ...Object.keys(colors ?? {}).map((key) =>
        bannerCSS(theme, key as APIDoctorColorKey, theme.components?.banner ?? colors),
      ),
      ...Object.keys(colors ?? {}).map((key) =>
        toastCSS(theme, key as APIDoctorColorKey, theme.components?.banner ?? colors),
      ),
      ...Object.keys(colors ?? {}).map((key) =>
        templateTagCSS(theme, key as APIDoctorColorKey, theme.components?.templateTag ?? colors),
      ),
    ].join('\n\n');
  } catch (err) {
    console.error('Failed to generate CSS', err);
  }

  return [`/* ${label} */`, `[data-theme="${id}"] {`, indent(themeCSS), '}'].join('\n');
}

export function addThemeStylesToDocument(rawTheme: Theme | null) {
  if (rawTheme == null) {
    console.error('Failed to add theme styles: theme is null');
    return;
  }

  const theme = completeTheme(rawTheme);
  let styleEl = document.head.querySelector(`style[data-theme]`);
  if (!styleEl) {
    styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
  }

  styleEl.setAttribute('data-theme', theme.id);
  styleEl.setAttribute('data-updated-at', new Date().toISOString());
  styleEl.textContent = getThemeCSS(theme);
}

export function setThemeOnDocument(theme: Theme | null) {
  if (theme == null) {
    console.error('Failed to set theme: theme is null');
    return;
  }

  document.documentElement.setAttribute('data-theme', theme.id);
}

export function indent(text: string, space = '    '): string {
  return text
    .split('\n')
    .map((line) => space + line)
    .join('\n');
}

function yc<T extends string | null | undefined>(
  theme: Theme,
  s: T,
): T extends string ? APIDoctorColor : null {
  if (s == null) return null as never;
  return new APIDoctorColor(s, theme.dark ? 'dark' : 'light') as never;
}

export function completeTheme(theme: Theme): Theme {
  const fallback = theme.dark ? defaultDarkTheme.base : defaultLightTheme.base;
  const c = (s: string | null | undefined) => yc(theme, s);

  theme.base.primary ??= fallback.primary;
  theme.base.secondary ??= fallback.secondary;
  theme.base.info ??= fallback.info;
  theme.base.success ??= fallback.success;
  theme.base.notice ??= fallback.notice;
  theme.base.warning ??= fallback.warning;
  theme.base.danger ??= fallback.danger;

  theme.base.surface ??= fallback.surface;
  theme.base.surfaceHighlight ??= c(theme.base.surface)?.lift(0.06)?.css();
  theme.base.surfaceActive ??= c(theme.base.primary)?.lower(0.2).translucify(0.8).css();

  theme.base.border ??= c(theme.base.surface)?.lift(0.12)?.css();
  theme.base.borderSubtle ??= c(theme.base.border)?.lower(0.08)?.css();

  theme.base.text ??= fallback.text;
  theme.base.textSubtle ??= c(theme.base.text)?.lower(0.3)?.css();
  theme.base.textSubtlest ??= c(theme.base.text)?.lower(0.5)?.css();

  return theme;
}
