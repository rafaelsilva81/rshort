import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/prisma';

const get_url = async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = req.query['slug'];

  if (!slug || typeof slug !== 'string') {
    res.statusCode = 404;
    res.send({
      error: 'No slug provided',
    });
    return;
  }

  const data = await db.shortLink.findFirst({
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  if (!data) {
    res.statusCode = 404;
    res.send({
      error: 'Link not found',
    });
    return;
  }

  return res.redirect(data.url);
};

export default get_url;
