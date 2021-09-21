const { exec } = require('child_process');

const commitAndRelease = (version) => {
    console.info('Version:', version);
    let versionType = '';
    if (version) {
        const versionSplit = version.split('.');
        const minor = versionSplit[2];
        if (minor === '0') {
            versionType = 'patch';
        } else if (minor !== '0') {
            versionType = 'minor';
        }
    }
    console.info('Version type (patch/minor):', versionType);
    exec(
        `npm run changelog -- --v=${version} && git add . && git commit -m "release(changelog): Update changelog [CI SKIP]" && git push origin HEAD:master && git tag -a v${version} -m "release(changelog): Update changelog [CI SKIP] " && git push origin v${version}`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(stderr);
                throw error;
            }
            console.info(`Changelog and tag pushed on master for v${version}`);
            if (versionType === 'patch') {
                exec(
                    `npm run release && git add . && `
                    + `git commit -m "release(version): Increase next develop version of v${version}" && git push origin HEAD:develop`,
                    (error1, stdout1, stderr1) => {
                        if (error) {
                            console.error(stderr1);
                            throw error1;
                        }
                        console.info(`Release and increase next develop version on develop`);
                    },
                );
            } else if (versionType !== 'minor') {
                throw new Error('Version type (patch/minor) not good');
            }

        });
};

const argv = [];
process.argv.forEach((val, index) => {
    argv[index] = val;
});

const version = argv[2];
commitAndRelease(version);
