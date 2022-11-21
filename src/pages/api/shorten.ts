import { NextApiRequest, NextApiResponse } from 'next';
import ShortUniqueId from 'short-unique-id';
import { z } from 'zod';
import { prisma as db } from '../../lib/prisma';

const shorten = async (req: NextApiRequest, res: NextApiResponse) => {
  // receive json

  const shortLinkBody = z.object({
    slug: z.string().optional(),
    url: z.string().url(),
  });

  const body = shortLinkBody.parse(req.body);
  let slug = body.slug;
  const url = body.url;

  if (!slug) {
    slug = new ShortUniqueId().randomUUID(6);
  } else if (slug.length > 20) {
    return res.status(400).json({
      error: 'Slug must be less than 20 characters',
    });
  }

  const exists = await db.shortLink.findUnique({
    where: {
      slug: slug,
    },
  });

  if (exists) {
    return res.status(409).json({
      message: 'Slug already exists',
    });
  }

  const data = await db.shortLink.create({
    data: {
      slug,
      url,
    },
  });

  if (!data) {
    return res.status(501).json({
      message: 'Something went wrong',
    });
  }

  // get domain this is running on
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
  return res.json({ link: `${process.env.DOMAIN}/s/${slug}` });
};

export default shorten;
