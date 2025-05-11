import {
  Wrench,
  Zap,
  Paintbrush,
  PenTool as Tools,
  Hammer,
  Thermometer,
  Truck,
  Home,
  Clock,
  Shield,
  Star,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export function Services() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Services - TradeHub24</title>
        <meta
          name="description"
          content="Discover our comprehensive range of home improvement and maintenance services. From plumbing and electrical to painting and renovation - find trusted professionals for all your needs."
        />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600">
            Find the right professional for any home improvement project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-[#105298] rounded-lg text-white">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold ml-3">{service.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.tasks.map((task, taskIndex) => (
                  <li
                    key={taskIndex}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <div className="w-1 h-1 bg-[#105298] rounded-full mr-2"></div>
                    {task}
                  </li>
                ))}
              </ul>
              <Link to="/find-pros">
                <button className="w-full mt-6 px-4 py-2 bg-[#e20000] text-white rounded-md hover:bg-[#cc0000] transition-colors">
                  Find Professionals
                </button>
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#105298] text-white rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-gray-600 mb-6">
            Contact us and we'll help you find the right professional for your
            specific needs
          </p>
          <Link to="/help/contact-us">
            <button className="px-8 py-3 bg-[#105298] text-white rounded-md hover:bg-[#0c3d72] transition-colors">
              Contact Support
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const services = [
  {
    name: "Plumbing",
    icon: <Wrench className="w-6 h-6" />,
    description: "Professional plumbing services for your home",
    tasks: [
      "Leak repairs",
      "Bathroom installation",
      "Boiler services",
      "Emergency repairs",
    ],
  },
  {
    name: "Electrical",
    icon: <Zap className="w-6 h-6" />,
    description: "Certified electrical services and installations",
    tasks: [
      "Rewiring",
      "Lighting installation",
      "Safety inspections",
      "Emergency repairs",
    ],
  },
  {
    name: "Painting",
    icon: <Paintbrush className="w-6 h-6" />,
    description: "Interior and exterior painting services",
    tasks: [
      "Interior painting",
      "Exterior painting",
      "Wallpaper installation",
      "Decorative finishes",
    ],
  },
  {
    name: "Carpentry",
    icon: <Tools className="w-6 h-6" />,
    description: "Custom carpentry and woodworking",
    tasks: [
      "Custom furniture",
      "Kitchen fitting",
      "Door installation",
      "Repairs",
    ],
  },
  {
    name: "Building",
    icon: <Hammer className="w-6 h-6" />,
    description: "General building and construction services",
    tasks: ["Extensions", "Renovations", "Structural work", "Plastering"],
  },
  {
    name: "HVAC",
    icon: <Thermometer className="w-6 h-6" />,
    description: "Heating, ventilation, and air conditioning",
    tasks: ["Installation", "Maintenance", "Repairs", "System upgrades"],
  },
  {
    name: "Landscaping",
    icon: <Truck className="w-6 h-6" />,
    description: "Professional garden and outdoor services",
    tasks: ["Garden design", "Lawn care", "Paving", "Fencing"],
  },
  {
    name: "Home Maintenance",
    icon: <Home className="w-6 h-6" />,
    description: "General home maintenance and repairs",
    tasks: [
      "General repairs",
      "Property maintenance",
      "Handyman services",
      "Safety checks",
    ],
  },
];

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Verified Professionals",
    description:
      "All professionals are thoroughly vetted and background-checked",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Quick Response",
    description: "Get quotes from available professionals within hours",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Satisfaction Guaranteed",
    description: "Your satisfaction is our top priority",
  },
];
