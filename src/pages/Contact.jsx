import { phone, email } from '../data/contact'

export default function Contact() {
  return (
    <div className="page-content">
      <p>
        122 Hastings Pond Rd.<br />
        Warwick, MA 01378
      </p>
      <p>{phone}</p>
      <p>
        <a href={`mailto:${email}`}>{email}</a>
      </p>
      <p>
        <em>
          One phone call can be worth a thousand emails. For lengthy questions
          that require lengthy answers, a phone call is often the most
          efficient way to communicate.
        </em>
      </p>
    </div>
  )
}
