function getUserMediaStream(): Promise<MediaStream> {
  const constraints = {
    video: {
      facingMode: 'environment',
    },
    audio: false,
  };

  if (navigator.mediaDevices?.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  return new Promise<MediaStream>((resolve, reject) => {
    const getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);

    getUserMedia(constraints, (stream) => {
      resolve(stream);
    }, (error) => {
      // An error occurred
      reject(error);
    });
  });
}

export async function getVideoStream({ abortSignal }: { abortSignal: AbortSignal }): Promise<{ video: HTMLVideoElement }> {
  const video = document.createElement('video');
  const stream = await getUserMediaStream();

  video.srcObject = stream;
  await video.play();

  function abort() {
    video.pause();
    video.srcObject = null;

    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  abortSignal.addEventListener('abort', () => {
    abort();
  });

  if (abortSignal.aborted) {
    abort();
  }

  return {
    video,
  }
}

export const codeScannerDialogUtils = {
  getVideoStream,
};
