const validSession = (req, res, next) => {
  console.log('Valid session check')
  console.log(req.session.user)
  if (req.session.user) {
    next()
  }
  else {
    res.redirect("/auth/sign-in")
  }
}

export default validSession
