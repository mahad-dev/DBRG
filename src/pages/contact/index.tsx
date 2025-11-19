import Hero from "@/components/custom/ui/hero";
import ContactForm from "./comps/ContactForm";
import Address from "./comps/Address";
import EmailPhone from "./comps/EmailPhone";
import ChooseDBRG from "./comps/ChooseDBRG";

export default function ContactPage() {
  return (
    <>
      <Hero
        image="/static/contact-bg.jpg"
        title="Contact Us"
        description="Home / Contact Us"
      />
      <ContactForm />
      <Address />
      <EmailPhone/>
      <ChooseDBRG/>
    </>
  );
}
