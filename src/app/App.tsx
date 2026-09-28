import { strings } from './strings.ts';

export function App() {
  return (
    <main>
      <h1>{strings.appName}</h1>
      <p>{strings.appTagline}</p>
    </main>
  );
}
