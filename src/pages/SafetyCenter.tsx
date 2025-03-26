import { Helmet } from 'react-helmet-async';

export function SafetyCenter() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Safety Center - TradeHub24</title>
        <meta name="description" content="Learn about TradeHub24's safety measures and guidelines. Find tips and resources to ensure a secure experience for both professionals and homeowners." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Safety Center</h1>
          <p className="text-xl text-gray-600">Welcome to the Safety Center. Here you'll find information on staying safe while using TradeHub24.</p>
        </div>
      </div>
    </div>
  );
}

export default SafetyCenter;
