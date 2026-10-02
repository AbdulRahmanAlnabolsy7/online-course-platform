import { test, expect } from "@playwright/test";
const stamp = Date.now();
const instructorEmail = `teacher-${stamp}@example.com`;
const studentEmail = `learner-${stamp}@example.com`;
const password = "PlatformTest123!";
const courseTitle = `Creative Backend ${stamp}`;
async function register(page, email, role) {
  await page.goto("/register");
  await page
    .getByLabel("Full name")
    .fill(role === "instructor" ? "Alex Instructor" : "Sam Learner");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("I want to").selectOption(role);
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`/${role}/dashboard$`));
}
async function login(page, email) {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
test("real instructor and student flows, persistence, ownership and responsive layouts", async ({
  page,
}) => {
  const consoleErrors = [];
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto("/instructor/courses");
  await expect(page).toHaveURL(/\/login$/);
  await register(page, instructorEmail, "instructor");
  await page.getByRole("button", { name: "Log out" }).click();
  await login(page, instructorEmail);
  await page
    .getByRole("link", { name: "Create a course", exact: true })
    .click();
  await page.getByLabel("Course title").fill(courseTitle);
  await page
    .getByLabel("Description", { exact: true })
    .fill("Build useful skills through focused lessons and guided practice.");
  await page.getByLabel("Category", { exact: true }).fill("programming");
  await page.getByLabel("Publish this course").check();
  await page
    .getByRole("button", { name: "Create course", exact: true })
    .click();
  await expect(page).toHaveURL(/\/instructor\/courses\/[^/]+\/lessons$/);
  const courseId = page.url().split("/").at(-2);
  await page.getByRole("button", { name: "Add lesson", exact: true }).click();
  await page.getByLabel("Lesson title").fill("Your first chapter");
  await page
    .getByLabel("Lesson content")
    .fill("This protected content is for enrolled learners.");
  await page.getByLabel("Duration (minutes)").fill("12");
  await page
    .locator("form")
    .getByRole("button", { name: "Add lesson", exact: true })
    .click();
  await expect(
    page.getByText("Your first chapter", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Edit Your first chapter", exact: true })
    .click();
  await page.getByLabel("Lesson title").fill("Your first chapter, refined");
  await page.getByRole("button", { name: "Save lesson", exact: true }).click();
  await expect(
    page.getByText("Your first chapter, refined", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add lesson", exact: true }).click();
  await page.getByLabel("Lesson title").fill("A temporary chapter");
  await page
    .getByLabel("Lesson content")
    .fill("Remove this chapter during testing.");
  await page
    .locator("form")
    .getByRole("button", { name: "Add lesson", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Delete A temporary chapter", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm delete", exact: true })
    .click();
  await expect(
    page.getByText("A temporary chapter", { exact: true }),
  ).toHaveCount(0);
  await page.goto(`/instructor/courses/${courseId}/edit`);
  await page.getByLabel("Course title").fill(`${courseTitle} Updated`);
  await page.getByRole("button", { name: "Save course", exact: true }).click();
  await expect(page).toHaveURL(/\/instructor\/courses$/);
  await expect(
    page.getByText(`${courseTitle} Updated`, { exact: true }),
  ).toBeVisible();
  await page.goto("/instructor/dashboard");
  await expect(page.getByText("Your courses at a glance")).toBeVisible();
  await page.goto("/student/dashboard");
  await expect(
    page.getByText("This space is for a different role"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Log out" }).click();
  await page.goto(`/courses/${courseId}`);
  await expect(
    page.getByText("This protected content is for enrolled learners.", {
      exact: true,
    }),
  ).toHaveCount(0);
  await register(page, studentEmail, "student");
  await page.getByRole("button", { name: "Log out" }).click();
  await login(page, studentEmail);
  await page.goto("/instructor/courses");
  await expect(
    page.getByText("This space is for a different role"),
  ).toBeVisible();
  await page.goto("/courses");
  await page.getByLabel("Search courses").fill("Creative Backend");
  await page
    .getByLabel("Category", { exact: true })
    .selectOption("programming");
  await page.getByLabel("Level", { exact: true }).selectOption("beginner");
  await page.getByLabel("Sort by").selectOption("rating");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(
    page.getByRole("link", { name: `${courseTitle} Updated`, exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: `${courseTitle} Updated`, exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Enroll in course" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Edit this course" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Enroll in course" }).click();
  await expect(page.getByText("You're enrolled")).toBeVisible();
  await page.goto("/student/courses");
  await page.getByRole("link", { name: "Continue learning" }).click();
  await expect(
    page.getByRole("heading", { name: "Your first chapter, refined" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Mark lesson complete", exact: true })
    .click();
  await expect(page.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "100",
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Mark incomplete", exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Your comment", { exact: true })
    .fill("This lesson helped me understand the concept.");
  await page.getByRole("button", { name: "Post comment" }).click();
  await expect(
    page.getByText("This lesson helped me understand the concept.", {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit comment", exact: true }).click();
  await page
    .getByLabel("Edit your comment")
    .fill("My updated thoughts on the lesson.");
  await page.getByRole("button", { name: "Save comment" }).click();
  await expect(
    page.getByText("My updated thoughts on the lesson.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete comment", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm delete", exact: true })
    .click();
  await expect(
    page.getByText("My updated thoughts on the lesson.", { exact: true }),
  ).toHaveCount(0);
  await page.goto(`/courses/${courseId}`);
  await page.getByRole("radio", { name: "4 stars", exact: true }).click();
  await page
    .getByLabel("Your review (optional)")
    .fill("A thoughtful course with clear lessons.");
  await page.getByRole("button", { name: "Submit rating" }).click();
  await expect(
    page.getByRole("button", { name: "Update rating" }),
  ).toBeVisible();
  await page.getByRole("radio", { name: "5 stars", exact: true }).click();
  await page.getByRole("button", { name: "Update rating" }).click();
  await expect(
    page.getByRole("radio", { name: "5 stars", exact: true }),
  ).toHaveAttribute("aria-checked", "true");
  await page.getByRole("button", { name: "Delete rating" }).click();
  await page
    .getByRole("button", { name: "Confirm delete", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Submit rating" }),
  ).toBeVisible();
  await page.goto("/student/dashboard");
  await expect(
    page.getByText("Completed courses", { exact: true }),
  ).toBeVisible();
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Your next chapter/ }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
  }
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(page).toHaveURL(/\/student\/dashboard$/);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "Log out" }).click();
  await login(page, instructorEmail);
  await page.goto("/instructor/courses");
  await page
    .getByRole("button", { name: `Delete ${courseTitle} Updated`, exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm delete", exact: true })
    .click();
  await expect(
    page.getByText(`${courseTitle} Updated`, { exact: true }),
  ).toHaveCount(0);
  expect(consoleErrors).toEqual([]);
});
