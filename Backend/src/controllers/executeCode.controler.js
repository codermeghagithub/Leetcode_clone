import { db } from '../lib/db.js';
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../lib/judge0.js";
// 🌟 Main controller function to handle code execution and submission

export const executeCode = async (req, res) => {
  const { source_code, language_id, stdin, expected_output, problemId } =
    req.body;
  const userId = req.user.id;

  try {
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_output) ||
      expected_output.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or missing test cases" });
    }
    //  * Prepare submissions for Judge0
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
      base64_encoded: false,
      wait: false,
    }));
    // * submit batch
    const submitRespose = await submitBatch(submissions); // this submit batch return token
    // *Token
    const tokens = submitRespose.map((res) => res.token);
    // * poll for result
    const result = await pollBatchResults(tokens);
    // ** Analyze test results
    let allpassed = true;


    const detailedResults = result.map((res, i) => {
      const stdout = res.stdout?.trim() || null;
      const expected = expected_output[i]?.trim();
      const passed = stdout === expected;

      if (!passed) allpassed = false;
      return {
        testCase: i + 1,
        passed,
        stdout,
        expected,
        stderr: res.stderr || null,
        compile_output: res.compile_output || null,
        status: res.status.description,
        memory: res.memory ? `${res.memory} KB` : undefined,
        time: res.time ? `${res.time} s` : undefined,
      };
    });

    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allpassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });
    if (allpassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: { userId, problemId },
        },
        update: {},
        create: { userId, problemId },
      });
    }
    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));
    await db.testCaseResult.createMany({data:testCaseResults});

    // * Fetch full submission with test cases
    const submissionWithTestCases=await db.submission.findUnique({where: {id:submission.id},
     include: { testCases: true },
  });
  // * 📤 Respond to client

  res.status(200).json({
    success:true,
    message:'code executed successfully',
    submission: submissionWithTestCases
  });
}catch (error) {
  console.error("error executing code :",error.message);
  res.status(500).json({error:"Failed to execute code"});
  

}
};
