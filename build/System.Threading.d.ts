﻿/// <reference path="System.d.ts" />
declare module System.Threading {
    class CancellationToken {
        public canBeCancelled: boolean;
        public isCancellationRequested: boolean;
        public throwIfCancelltionRequested: boolean;
        static none : CancellationToken;
    }
}
declare module System.Threading.Tasks {
    interface ITask<TResult> extends IDisposable, IEquatable<ITask<TResult>> {
        asyncState: Object;
        creationOptions: TaskCreationOptions;
        exception: Error;
        id: number;
        isRunning: boolean;
        isCancelled: boolean;
        isCompleted: boolean;
        isFaulted: boolean;
        result: TResult;
        status: TaskStatus;
        runSynchronously(scheduler?: TaskScheduler): void;
        start(scheduler?: TaskScheduler): void;
        wait(): void;
        wait(token: CancellationToken): void;
        wait(milliseconds: number, token?: CancellationToken): void;
    }
    class Task<TResult> extends DisposableBase implements ITask<TResult> {
        private _task;
        private _asyncState;
        private _cancellationToken;
        private _creationOptions;
        constructor(_task: (state?: Object) => TResult, _asyncState?: Object, _cancellationToken?: CancellationToken, _creationOptions?: TaskCreationOptions);
        private _id;
        public id : number;
        private _result;
        public result : TResult;
        private _exception;
        public exception : Error;
        public asyncState : Object;
        public creationOptions : TaskCreationOptions;
        private _status;
        public status : TaskStatus;
        public isRunning : boolean;
        public isCancelled : boolean;
        public isCompleted : boolean;
        public isFaulted : boolean;
        public runSynchronously(scheduler?: TaskScheduler): void;
        public start(scheduler?: TaskScheduler): void;
        public wait(): void;
        public wait(token: CancellationToken): void;
        public wait(milliseconds: number, token?: CancellationToken): void;
        public wait(time: TimeSpan, token?: CancellationToken): void;
        public equals(other: Task<TResult>): boolean;
        private _scheduler;
        public _executingTaskScheduler : ITaskScheduler;
        public _executeEntry(bPreventDoubleExecution: boolean): boolean;
    }
    enum TaskStatus {
        Created = 0,
        WaitingForActivation = 1,
        WaitingToRun = 2,
        Running = 3,
        Blocked = 4,
        WaitingForChildrenToComplete = 5,
        RanToCompletion = 6,
        Canceled = 7,
        Faulted = 8,
    }
    enum TaskCreationOptions {
        None = 0,
        PreferFairness = 1,
        LongRunning = 2,
        AttachedToParent = 4,
        DenyChildAttach = 8,
        HideScheduler = 16,
    }
    enum TaskContinuationOptions {
        None = 0,
        PreferFairness = 1,
        LongRunning = 2,
        AttachedToParent = 4,
        DenyChildAttach = 8,
        HideScheduler = 16,
        LazyCancellation = 32,
        NotOnRanToCompletion = 65536,
        NotOnFaulted = 131072,
        NotOnCanceled = 262144,
        OnlyOnRanToCompletion,
        OnlyOnFaulted,
        OnlyOnCanceled,
        ExecuteSynchronously = 524288,
    }
}
declare module System.Threading.Tasks {
    interface ITaskScheduler {
        id: number;
        maximumConcurrencyLevel: number;
        queueTask(task: Task<any>): void;
    }
    class TaskScheduler implements ITaskScheduler {
        private _maximumConcurrencyLevel;
        constructor(_maximumConcurrencyLevel?: number);
        static current : ITaskScheduler;
        static default : ITaskScheduler;
        static fromCurrentSynchronizationContext(): ITaskScheduler;
        private _id;
        public id : number;
        public maximumConcurrencyLevel : number;
        private _queue;
        public _getScheduledTasks(): Collections.IArray<ITask<any>>;
        private _workerId;
        private _ensureWorkerReady();
        public queueTask(task: Task<any>): void;
        public _tryDequeue(task: Task<any>): boolean;
        public _tryExecuteTask(task: Task<any>): boolean;
        public tryExecuteTaskInline(task: Task<any>, taskWasPreviouslyQueued: boolean): boolean;
    }
}
