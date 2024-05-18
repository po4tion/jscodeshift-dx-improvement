console.debug({
  developer: "po4tion1",
  filepath: "./transform/findAndModifyToLogger.test.ts"
});

const a = () => {
  console.info({
    developer: "po4tion2",
    filepath: "./transform/findAndModifyToLogger.test.ts"
  });
};

function b() {
  console.error({
    developer: "po4tion3",
    filepath: "./transform/findAndModifyToLogger.test.ts"
  });
}

class C {
  constructor() {
    console.warn({
      developer: "po4tion3",
      filepath: "./transform/findAndModifyToLogger.test.ts"
    });
  }
}
