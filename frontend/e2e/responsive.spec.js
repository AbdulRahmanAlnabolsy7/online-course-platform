import { test, expect } from "@playwright/test";
const base = process.env.VITE_API_URL || "http://localhost:5000/api/v1";
test("student learning and instructor forms fit tablet and mobile", async ({
  page,
  request,
}) => {
  const stamp = Date.now();
  async function account(role) {
    const result = await request.post(`${base}/auth/register`, {
      data: {
        name: `Responsive ${role}`,
        email: `responsive-${role}-${stamp}@example.com`,
        password: "ResponsiveTest123!",
        role,
      },
    });
    expect(result.status()).toBe(201);
    return (await result.json()).data;
  }
  const instructor = await account("instructor");
  const student = await account("student");
  const headers = { Authorization: `Bearer ${instructor.token}` };
  const created = await request.post(`${base}/courses`, {
    headers,
    data: {
      title: `Responsive Course ${stamp}`,
      description: "A real course for testing responsive learning layouts.",
      category: "design",
      isPublished: true,
    },
  });
  expect(created.status()).toBe(201);
  const courseId = (await created.json()).data._id;
  try {
    const lesson = await request.post(`${base}/courses/${courseId}/lessons`, {
      headers,
      data: {
        title: "A responsive learning chapter",
        content: "This lesson is loaded from the actual API.",
        duration: 10,
        order: 1,
      },
    });
    expect(lesson.status()).toBe(201);
    expect(
      (
        await request.post(`${base}/courses/${courseId}/enroll`, {
          headers: { Authorization: `Bearer ${student.token}` },
        })
      ).status(),
    ).toBe(201);
    await page.goto("/");
    async function session(token) {
      await page.evaluate(
        (value) => localStorage.setItem("luma.auth.token", value),
        token,
      );
    }
    await session(student.token);
    for (const width of [768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [path, heading] of [
        [`/courses/${courseId}`, `Responsive Course ${stamp}`],
        ["/student/courses", "My learning"],
        ["/student/dashboard", /A new day to grow/],
        [`/learn/${courseId}`, "A responsive learning chapter"],
      ]) {
        await page.goto(path);
        await expect(
          page.getByRole("heading", {
            name: heading,
            exact: typeof heading === "string",
          }),
        ).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
      }
      await page.screenshot({
        path: `test-results/learning-${width}.png`,
        fullPage: true,
      });
      await page.goto("/courses");
      await expect(
        page.getByRole("heading", { name: "Find your next possibility." }),
      ).toBeVisible();
      await expect(page.getByLabel("Search courses")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
    await session(instructor.token);
    for (const width of [768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const [path, heading] of [
        ["/instructor/dashboard", /Ideas grow when you share/],
        ["/instructor/courses", "Make your knowledge go further."],
        ["/instructor/courses/new", "What will you teach the world?"],
        [`/instructor/courses/${courseId}/edit`, "Refine your next chapter."],
      ]) {
        await page.goto(path);
        await expect(
          page.getByRole("heading", { name: heading }),
        ).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBe(true);
      }
      await page.goto(`/instructor/courses/${courseId}/lessons`);
      await page
        .getByRole("button", { name: "Add lesson", exact: true })
        .click();
      await expect(page.getByLabel("Lesson title")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `test-results/lesson-manager-${width}.png`,
        fullPage: true,
      });
    }
  } finally {
    await request.delete(`${base}/courses/${courseId}`, { headers });
  }
});
