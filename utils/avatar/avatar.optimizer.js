import jimp from 'jimp';

const optimizeAvatar = async (image, optimizedAvatarPath) => {
    await Jimp.read(image)
      .then(avatar => {
        avatar.resize(250, 250).quality(60).write(optimizedAvatarPath);
      })
      .catch(e => {
        throw e;
      });
  };

  export default optimizeAvatar
