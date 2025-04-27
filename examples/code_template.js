// Replace the code below with user's code
// USER CODE HERE
function merge(nums1, m, nums2, n) {

}
// END USER CODE

const testCases = [
  {
    input: [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3],
    expected: [1, 2, 2, 3, 5, 6]
  },
  {
    input: [[1], 1, [], 0],
    expected: [1]
  },
  {
    input: [[0], 0, [1], 1],
    expected: [1]
  },
  {
    input: [[4, 5, 6, 0, 0, 0], 3, [1, 2, 3], 3],
    expected: [1, 2, 3, 4, 5, 6]
  }
];

function runTests() {
  let passedCount = 0;
  const totalCount = testCases.length;

  for (let i = 0; i < testCases.length; i++) {
    const { input, expected } = testCases[i];
    const [nums1, m, nums2, n] = JSON.parse(JSON.stringify(input));

    merge(nums1, m, nums2, n);

    if (JSON.stringify(nums1) !== JSON.stringify(expected)) {
      const errorMessage = {
        passed: `${passedCount}/${totalCount}`,
        message: `Test case ${i + 1} failed: expected ${JSON.stringify(expected)}, but got ${JSON.stringify(nums1)}`,
      };

      throw new Error(errorMessage);
    }

    passedCount++;
  }

  console.log({
    passed: `${passedCount}/${totalCount}`,
    message: "All tests passed!"
  });
}

runTests();