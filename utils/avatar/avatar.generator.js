import gravatar from "gravatar";

const generateAvatar = (email) =>
  gravatar.url(email, {
    protocol: "https",
    s: "100",
    r: "g",
    d: "identicon",
  });

export default generateAvatar;
