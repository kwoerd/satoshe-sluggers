"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!consentChecked) {
      alert("Please accept the Privacy Policy and Terms to continue.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      // Reset form and show success message
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setConsentChecked(false)
      setSubmitted(true)

    } catch (error) {
      console.error('Error sending message:', error)
      alert(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col pt-24 sm:pt-28">
      <Navigation activePage="contact" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12 sm:pb-20 flex-grow" role="main" aria-labelledby="contact-heading">
        <div className="text-center mb-6 sm:mb-8">
          <h1 id="contact-heading" className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "#fffbeb" }}>
            CONTACT US
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4" style={{ color: "#fffbeb" }}>
            Reach out with questions, feedback, or press inquiries.
          </p>
        </div>

        <div
          className="bg-card rounded p-6 border border-neutral-700 shadow-lg"
          role="region"
          aria-labelledby="contact-form-heading"
        >
          {submitted ? (
            <div className="text-center py-8" role="status" aria-live="polite">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded bg-green-500/20 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 id="submission-status" className="text-xl font-bold mb-2">
                Message Sent!
              </h2>
              <p className="mb-6" style={{ color: "#fffbeb" }}>Thank you for reaching out. We'll get back to you as soon as possible.</p>
              <Button
                onClick={() => setSubmitted(false)}
                className="py-3 px-6 text-base font-medium focus:ring-4 transition-colors"
                style={{
                  color: "#fffbeb",
                  backgroundColor: "#FF0099",
                  borderColor: "#FF0099"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#DB2777"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#FF0099"}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="contact-form-heading">
              <h2 id="contact-form-heading" className="sr-only">
                Contact Form
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-base font-medium" style={{ color: "#fffbeb" }}>
                    Name{" "}
                    <span style={{ color: "#FF0099" }} aria-hidden="true">
                      *
                    </span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="bg-neutral-800 border-neutral-700 font-normal"
                    style={{ color: "#FF0099" }}
                    aria-required="true"
                    aria-describedby="name-error"
                    spellCheck={false}
                  />
                  <div id="name-error" className="text-red-500 text-sm min-h-5 hidden">
                    Please enter your name
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-base font-medium" style={{ color: "#fffbeb" }}>
                    Email{" "}
                    <span style={{ color: "#FF0099" }} aria-hidden="true">
                      *
                    </span>
                    <span className="sr-only">(required)</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="bg-neutral-800 border-neutral-700 font-normal"
                    style={{ color: "#FF0099" }}
                    aria-required="true"
                    aria-describedby="email-error"
                    autoComplete="email"
                    spellCheck={false}
                  />
                  <div id="email-error" className="text-red-500 text-sm min-h-5 hidden">
                    Please enter a valid email address
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-base font-medium" style={{ color: "#fffbeb" }}>
                  Subject{" "}
                  <span style={{ color: "#FF0099" }} aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only">(required)</span>
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this regarding?"
                  className="bg-neutral-800 border-neutral-700 font-normal"
                  style={{ color: "#FF0099" }}
                  aria-required="true"
                  aria-describedby="subject-error"
                  spellCheck={false}
                />
                <div id="subject-error" className="text-red-500 text-sm min-h-5 hidden">
                  Please enter a subject
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="block text-base font-medium" style={{ color: "#fffbeb" }}>
                  Message{" "}
                  <span style={{ color: "#FF0099" }} aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only">(required)</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="min-h-[150px] bg-neutral-800 border-neutral-700 font-normal"
                  style={{ color: "#FF0099" }}
                  placeholder="How can we help you?"
                  aria-required="true"
                  aria-describedby="message-error"
                  spellCheck={false}
                />
                <div id="message-error" className="text-red-500 text-sm min-h-5 hidden">
                  Please enter your message
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-4">
                <Checkbox
                  id="terms"
                  checked={consentChecked}
                  onCheckedChange={(checked) => setConsentChecked(checked === true)}
                  className="mt-1 h-5 w-5"
                  style={{
                    backgroundColor: consentChecked ? "#FF0099" : "transparent",
                    borderColor: "#FF0099"
                  }}
                  aria-describedby="terms-desc"
                  required
                  aria-required="true"
                />
                <Label htmlFor="terms" className="cursor-pointer text-base !font-normal" id="terms-desc" style={{ color: "#fffbeb" }}>
                  I accept the{" "}
                  <a
                    href="https://retinaldelights.io/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-80 focus:outline-2"
                    style={{ color: "#FF0099" }}
                    aria-label="Privacy Policy (opens in a new window)"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://retinaldelights.io/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-80 focus:outline-2"
                    style={{ color: "#FF0099" }}
                    aria-label="Terms of Service (opens in a new window)"
                  >
                    Terms
                  </a>
                  .{" "}
                  <span style={{ color: "#FF0099" }} aria-hidden="true">
                    *
                  </span>
                  <span className="sr-only">(required)</span>
                </Label>
              </div>

              <div className="text-neutral-400 text-sm pt-2">
                <span style={{ color: "#FF0099" }}>*</span> Required fields
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3 px-8 text-lg font-medium focus:ring-4 transition-colors"
                  style={{
                    color: "#fffbeb",
                    backgroundColor: "#FF0099",
                    borderColor: "#FF0099"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#DB2777"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#FF0099"}
                  aria-live="polite"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
