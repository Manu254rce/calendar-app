module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setUpFilesAfterEnv: ['/frontend/src/setupTests.ts'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
}