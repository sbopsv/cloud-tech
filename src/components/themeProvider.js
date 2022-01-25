import * as React from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { default as defaultTheme } from './theme';
import Header from '../components/Header';
import './styles.css';

export default function ThemeProvider({ children, theme = {}, location }) {
  return (
    <div id="viewport" className="viewport">
      {/* <AnnouncementBanner /> */}
      <Header location={location} />
      {/* <SubHeader location={location} /> */}
      <EmotionThemeProvider theme={{ ...defaultTheme, ...theme }}>{children}</EmotionThemeProvider>

    </div>
  );
}
