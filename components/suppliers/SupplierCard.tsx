import React from 'react';
import VisitShopButton from './VisitShopButton';
import Image from 'next/image';
import { SupplierCardProps } from '@/types/seller';

const SupplierCard: React.FC<SupplierCardProps> = ({
  name,
  location,
  logo,
  website,
  supplierId,
}) => {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 flex items-center justify-center group transition-transform duration-300 ease-in-out">
      <div className="rounded-2xl p-5 w-full flex items-center border border-primary-500/20 bg-white/90 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-200">
        <Image
          src={logo}
          alt={name}
          width={90}
          height={90}
          className="w-20 h-20 md:w-24 md:h-24 mr-5 rounded-xl border border-primary-500/20 bg-white object-contain p-2 shadow"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 truncate mb-1 flex items-center gap-2">
            {name}
          </h2>
          <p className="text-gray-500 text-xs md:text-sm mb-1 flex items-center gap-1">
            <svg
              className="w-4 h-4 text-primary-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {location}
          </p>
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 text-xs md:text-sm hover:underline flex items-center gap-1 mb-2"
            >
              <svg
                className="w-4 h-4 text-primary-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19v-6m0 0V5m0 8H5m7 0h7"
                />
              </svg>
              {website.replace(/^https?:\/\//, '')}
            </a>
          )}
          <div className="mt-2">
            <VisitShopButton supplierId={supplierId} from={'supplier'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;
