import React from 'react';
import { Disclosure as HeadlessDisclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Disclosure({ title, children, defaultOpen = false }: DisclosureProps) {
  return (
    <HeadlessDisclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <HeadlessDisclosure.Button className="flex w-full justify-between items-center px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg">
            <span className="font-medium">{title}</span>
            <ChevronDown
              className={`${
                open ? 'transform rotate-180' : ''
              } w-5 h-5 text-gray-500 transition-transform duration-200`}
            />
          </HeadlessDisclosure.Button>
          <HeadlessDisclosure.Panel className="px-4 pt-4 pb-2">
            {children}
          </HeadlessDisclosure.Panel>
        </>
      )}
    </HeadlessDisclosure>
  );
}