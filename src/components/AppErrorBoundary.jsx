import { Component } from "react";

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto grid min-h-screen max-w-xl place-items-center px-5 text-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-amber-300">
              Unexpected error
            </p>
            <h1 className="mt-4 font-serif text-4xl text-white">
              We could not load this page.
            </h1>
            <p className="mt-4 leading-7 text-stone-300">
              Please refresh the page. If the problem continues, contact the
              property team.
            </p>
            <a
              className="mt-8 inline-block rounded-xl bg-amber-400 px-5 py-3 font-bold text-stone-950"
              href="/"
            >
              Return home
            </a>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
