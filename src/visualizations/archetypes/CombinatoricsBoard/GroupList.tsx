import styles from './CombinatoricsBoard.module.css';

export interface CountedGroup {
  key: string;
  title: string;
  /** Members already placed in the group, as text. */
  members?: string;
  filled: number;
  capacity: number;
}

interface GroupListProps {
  label: string;
  groups: readonly CountedGroup[];
  current?: string;
  wide?: boolean;
}

/**
 * Cards that collect the listed objects into classes. Each card shows a meter
 * with one cell per member, so equal class sizes are visible at a glance.
 */
export function GroupList({ label, groups, current, wide = false }: GroupListProps) {
  return (
    <ul
      tabIndex={0}
      className={wide ? `${styles.groups} ${styles.groupsWide}` : styles.groups}
      aria-label={label}
    >
      {groups.map((group) => {
        const classes = [styles.group];
        if (group.filled === 0) classes.push(styles.groupEmpty);
        if (group.key === current) classes.push(styles.groupCurrent);
        return (
          <li key={group.key} className={classes.join(' ')}>
            <span className={styles.groupTitle}>{group.title}</span>
            <span
              className={styles.meter}
              role="img"
              aria-label={`${group.filled} de ${group.capacity}`}
            >
              {Array.from({ length: group.capacity }, (_, index) => (
                <span
                  key={index}
                  className={
                    index < group.filled
                      ? `${styles.meterCell} ${styles.meterFilled}`
                      : styles.meterCell
                  }
                />
              ))}
            </span>
            {group.members && <span className={styles.groupMembers}>{group.members}</span>}
          </li>
        );
      })}
    </ul>
  );
}
