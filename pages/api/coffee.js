// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(418).json({
    error: true,
    message: "418: I'm a teapot"
  })
}
