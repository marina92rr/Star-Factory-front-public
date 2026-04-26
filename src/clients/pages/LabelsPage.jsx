import React, { useEffect } from 'react'
import { useLabelsStore } from '../../hooks/useLabelsStore'
import { isColorDark } from '../../helpers/isColorDark';
import { LabelAddNew } from '../components/label/LabelAddNew';
import { CreateLabelModal } from '../components/label/CreateLabelModal';
import { LabelDelete } from '../components/label/LabelDelete';
import { LabelEdit } from '../components/label/LabelEdit';

export const LabelsPage = () => {

  const { labels, starLoadingLabels } = useLabelsStore();

  useEffect(() => {
    starLoadingLabels();
  }, []);

  return (
    <div className='m-5 fade-in'>
      <div className='pt-5 align-items-center'>
        <h1 className='mb-4'>Etiquetas</h1>
        <LabelAddNew />
      </div>

      <div className="d-flex flex-column mt-3">
        <div className='border bg-light rounded-top p-3'>
          <strong>{labels.length} etiquetas</strong>
        </div>

        {labels.map(label => {
          const isDark = isColorDark(label.color);
          const textColor = isDark ? '#fff' : '#222';
          return (
            <div key={label.idLabel} className="border p-4">
              <div className="d-flex align-items-center gap-3">
                <li className="list-unstyled col-4">
                  <span
                    className="badge rounded-pill fw-semibold"
                    style={{
                      backgroundColor: label.color,
                      color: textColor,
                      fontSize: '0.75rem',
                      padding: '5px 10px',
                      letterSpacing: '0.01em',
                      borderRadius: '12px',
                      lineHeight: '1.2',
                      marginRight: '4px'
                    }}
                  >
                    {label.name}
                  </span>
                </li>

                <span className="text-secondary">
                  {label.memberCount ?? 0} cliente{(label.memberCount ?? 0) === 1 ? '' : 's'}
                </span>

                <div className='ms-auto d-flex gap-1'>
                  <LabelEdit label={label} />
                  <LabelDelete label={label} />

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 👇 ÚNICO modal para crear/editar */}
      <CreateLabelModal />
    </div>
  )
}
export default LabelsPage;
