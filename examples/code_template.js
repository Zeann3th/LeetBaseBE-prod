// Replace the code below with user's code
//--code--

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
  let count = 0;
  for (const { input, expected } of testCases) {
    const [nums1, m, nums2, n] = JSON.parse(JSON.stringify(input));
    merge(nums1, m, nums2, n);
    if (JSON.stringify(nums1) !== JSON.stringify(expected)) {
      console.log(JSON.stringify({
        status: 'FAILED',
        progress: `${count}/${testCases.length}`,
        input: input,
        expected_output: expected,
        user_output: nums1
      }, null, 2));
      return;
    }
    count++;
  }
  console.log(JSON.stringify({ status: 'ACCEPTED', progress: `${count}/${testCases.length}` }));
}

runTests();
