import { PortableText, PortableTextComponents } from '@portabletext/react';
import Figure from './Figure';
import styles from './Block.module.scss';
import React, { FunctionComponent, ReactNode } from 'react';
import Link from 'next/link';

interface ImageValue {
  asset: any;
  caption?: string;
}

interface LinkValue {
  href: string;
  alt?: string;
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: ImageValue }) => {
      return (
          <figure>
            <Figure image={value.asset} alt={value.caption || ''} />
            {value.caption ? <figcaption>{value.caption}</figcaption> : null}
          </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }: { children?: ReactNode; value?: LinkValue }) => {
      if (!value?.href) {
        return <>{children}</>;
      }
      return (
          <Link href={value.href}
                target={'_blank'}
                prefetch={false}
          >
            {children}
          </Link>
      );
    },
  },
};

const plainComponents: PortableTextComponents = {
  ...components,
  marks: {
    ...components.marks,
    link: ({ children }: { children?: ReactNode }) => {
      return <span>{children}</span>;
    },
  },
};

interface BlockContentProps {
  readonly blocks?: any;
  readonly disableLinks?: boolean;
}

const BlockContent: FunctionComponent<BlockContentProps> = ({ blocks, disableLinks }) => {
  return <PortableText value={blocks} components={disableLinks ? plainComponents : components} />;
};

export default BlockContent;
