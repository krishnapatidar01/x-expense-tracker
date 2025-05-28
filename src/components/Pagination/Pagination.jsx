import styles from './Pagination.module.css';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";

export default function Pagination({ updatePage, currentPage, totalPages }) {

    const handlePrev = () => {
        if (currentPage > 1) {
            updatePage(prev => Math.max(prev - 1, 1)); // extra safety clamp
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            updatePage(prev => Math.min(prev + 1, totalPages)); // extra safety clamp
        }
    }

    return (
        <div className={styles.paginationWrapper}>
            <button onClick={handlePrev} disabled={currentPage === 1}>
                <IoIosArrowRoundBack />
            </button>

            <p>{currentPage}</p>

            <button onClick={handleNext} disabled={currentPage === totalPages}>
                <IoIosArrowRoundForward />
            </button>
        </div>
    )
}
