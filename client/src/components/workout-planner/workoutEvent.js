import { X, Plus } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import workoutEventService from "../../services/workoutEventService";
import { useQuery, useMutation, useQueryClient } from "react-query";

import { Modal, Table } from "flowbite-react";

export default function WorkoutEvent({
  event,
  movements,
  DeleteEventState,
  UpdateEventState,
}) {
  const [openModal, setOpenModal] = useState(false);

  const { getToken } = useAuth();

  const eventService = workoutEventService();
  const DeleteEvent = async () => {
    const token = await getToken();
    eventService.deleteWorkoutEvent(token, event.event_id);
    DeleteEventState(event.event_id);
  };
  const deleteMutation = useMutation(DeleteEvent);

  const InvalidateQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["workoutMovements" + event.event_id],
    });
    queryClient.invalidateQueries({
      queryKey: ["workoutCycle"],
    });
    queryClient.invalidateQueries({
      queryKey: ["restAnalysis"],
    });
    queryClient.invalidateQueries({
      queryKey: ["volumeAnalysis"],
    });
  };
  const fetchWorkoutMovements = async () => {
    const token = await getToken();
    return eventService.getWorkoutEventMovements(token, event.event_id);
  };
  const movementQuery = useQuery({
    queryKey: ["workoutMovements" + event.event_id],
    queryFn: fetchWorkoutMovements,
  });

  const AddMovement = async () => {
    const token = await getToken();
    return eventService.postWorkoutMovement(
      token,
      event.event_id,
      movementInput.sets,
      movementInput.reps,
      movementInput.movement_id
    );
  };
  function onCloseModal() {
    setOpenModal(false);
    //setEmail('');
  }

  const [movementInput, setMovementInput] = useState({
    movement_id: "1",
    sets: "5",
    reps: "5",
  });

  const queryClient = useQueryClient();
  const movementMutation = useMutation({
    mutationFn: AddMovement,
    // When mutate is called:
    onMutate: async (newWorkoutMovement) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["workoutMovements" + event.event_id],
      });

      // Snapshot the previous value
      const previous = queryClient.getQueryData([
        "workoutMovements" + event.event_id,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["workoutMovements" + event.event_id], (old) => [
        ...old,
        newWorkoutMovement,
      ]);

      // Return a context object with the snapshotted value
      return { previous };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(
        ["workoutMovements" + event.event_id],
        context.previous
      );
    },
    // Always refetch after error or success:
    onSettled: InvalidateQueries,
  });
  const DeleteMovement = async (relation_id) => {
    const token = await getToken();
    return eventService.deleteWorkoutEventMovement(token, relation_id);
  };
  const movementDeleteMutation = useMutation({
    mutationFn: (relation_id) => DeleteMovement(relation_id),
    // Always refetch after error or success:
    onSettled: InvalidateQueries,
  });
  const UpdateName = (newName) => {
    var updated = {
      ...event,
      name: newName,
    };
    UpdateEventState(updated);
  };
  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      const token = await getToken();
      eventService.putWorkoutEvent(token, event);
    }
  };
  return (
    <>
      <div className="flex flex-row">
        <button
          className="flex flex-col whitespace-nowrap justify-between bg-white px-4 py-2 my-2 rounded-2xl w-4/5 text-lg hover:bg-slate-50"
          onClick={() => setOpenModal(true)}
        >
          <div className="flex flex-row justify-between border-none w-full text-left">
            <div className="w-3/4">{event.name}</div>
          </div>
          <div className="text-left">
            {movementQuery.data
              ?.map((movement) => movement.name)
              .filter((v, i, self) => i === self.indexOf(v))
              .map((muscle, index) => (
                <div key={index}>{muscle}</div>
              ))}
          </div>
        </button>
        <button
          className="text-red-400 hover:text-red-200 w-1/5 pl-3"
          onClick={deleteMutation.mutate}
        >
          <X size={28} />
        </button>
      </div>
      {openModal ? (
        <Modal show={openModal} size="lg" onClose={onCloseModal} popup>
          <Modal.Header>
            <input
              className="w-3/4 border-transparent"
              type="text"
              value={event.name}
              onChange={(e) => UpdateName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Modal.Header>
          <Modal.Body>
            <Table>
              <Table.Head>
                <Table.HeadCell>Movement</Table.HeadCell>
                <Table.HeadCell>Reps</Table.HeadCell>
                <Table.HeadCell>Sets</Table.HeadCell>
                <Table.HeadCell>Remove</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {movementQuery.data?.map((movement, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{movement.movement_name}</Table.Cell>
                    <Table.Cell>{movement.reps}</Table.Cell>
                    <Table.Cell>{movement.sets}</Table.Cell>
                    <Table.Cell>
                      <button
                        className="text-red-400 hover:text-red-200 w-1/5 pl-3"
                        onClick={() =>
                          movementDeleteMutation.mutate(movement.relation_id)
                        }
                      >
                        <X size={28} />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div className="flex flex-row items-center text-slate-800 text-md space-x-2">
              <button
                className="hover:text-slate-500"
                onClick={movementMutation.mutate}
              >
                <Plus size={20} />
              </button>
              <form className="flex-row justify-between w-full">
                <select
                  className="w-2/4"
                  onChange={(e) =>
                    setMovementInput({
                      ...movementInput,
                      movement_id: e.target.value,
                    })
                  }
                  value={movementInput.movement_id}
                >
                  {movements?.map((movement) => (
                    <option key={movement.name} value={movement.movement_id}>
                      {movement.name}
                    </option>
                  ))}
                </select>
                <input
                  className="w-1/4"
                  type="number"
                  placeholder="Reps"
                  value={movementInput.reps}
                  onChange={(e) =>
                    setMovementInput({ ...movementInput, reps: e.target.value })
                  }
                />
                <input
                  className="w-1/4"
                  type="number"
                  placeholder="Sets"
                  value={movementInput.sets}
                  onChange={(e) =>
                    setMovementInput({ ...movementInput, sets: e.target.value })
                  }
                />
              </form>
            </div>
          </Modal.Body>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
}
