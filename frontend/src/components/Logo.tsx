import { useLang } from '../i18n/LangContext';
import { LOGO } from './logoPaths';

/** The official Galleria Tbilisi wordmark, Georgian or Latin, in currentColor. */
export function Logo({ height = 40 }: { height?: number }) {
  const { lang, t } = useLang();
  const mark = lang === 'ka' ? LOGO.ka : LOGO.en;
  const [, , w, h] = mark.viewBox.split(' ').map(Number);
  return (
    <svg
      viewBox={mark.viewBox}
      height={height}
      width={(height * w) / h}
      fill="currentColor"
      role="img"
      aria-label={t('brand.name')}
      dangerouslySetInnerHTML={{ __html: mark.body }}
    />
  );
}
